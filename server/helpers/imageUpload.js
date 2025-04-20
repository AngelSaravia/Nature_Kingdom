const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure storage with better error handling
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), "uploads");
    console.log("Upload directory:", uploadDir);

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      console.log("Creating upload directory");
      try {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log("Upload directory created successfully");
      } catch (err) {
        console.error("Error creating upload directory:", err);
        return cb(
          new Error(`Failed to create upload directory: ${err.message}`)
        );
      }
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    try {
      // Create a more URL-friendly filename
      const timestamp = Date.now();
      const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
      const safeFilename = `${timestamp}-${originalName}`;
      console.log("Generated filename:", safeFilename);
      cb(null, safeFilename);
    } catch (err) {
      console.error("Error generating filename:", err);
      cb(new Error(`Failed to generate filename: ${err.message}`));
    }
  },
});

// Create multer upload instance with better file validation
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1, // Allow only 1 file per request
  },
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (!file.mimetype.startsWith("image/")) {
      console.log("Rejected file with mimetype:", file.mimetype);
      return cb(new Error("Only image files are allowed"));
    }

    // Whitelist specific image extensions for extra safety
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      console.log("Rejected file with extension:", ext);
      return cb(
        new Error(
          `File extension ${ext} is not allowed. Allowed extensions: ${allowedExtensions.join(
            ", "
          )}`
        )
      );
    }

    cb(null, true);
  },
});

// Export middleware handler with improved logging and error handling
const handleImageUpload = (req, res) => {
  console.log("Processing image upload request");

  // Handle single file upload
  upload.single("file")(req, res, function (err) {
    if (err) {
      console.error("Multer error:", err);
      return res
        .writeHead(400, { "Content-Type": "application/json" })
        .end(JSON.stringify({ success: false, message: err.message }));
    }

    if (!req.file) {
      console.error("No file received in request");
      return res
        .writeHead(400, { "Content-Type": "application/json" })
        .end(JSON.stringify({ success: false, message: "No file uploaded" }));
    }

    console.log("File successfully uploaded:", {
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });

    // Return success with file info and verify file exists
    const fileUrl = `/uploads/${req.file.filename}`;

    // Verify the file was actually saved
    if (!fs.existsSync(req.file.path)) {
      console.error("File was not saved to disk:", req.file.path);
      return res.writeHead(500, { "Content-Type": "application/json" }).end(
        JSON.stringify({
          success: false,
          message: "File upload failed - could not save file to disk",
        })
      );
    }

    // Return success response with adequate information
    return res.writeHead(200, { "Content-Type": "application/json" }).end(
      JSON.stringify({
        success: true,
        message: "File uploaded successfully",
        imageUrl: fileUrl,
        file: {
          originalName: req.file.originalname,
          fileName: req.file.filename,
          size: req.file.size,
          mimetype: req.file.mimetype,
          url: fileUrl,
        },
      })
    );
  });
};

// Helper function to clean up orphaned files (can be used in error handlers)
const cleanupOrphanedFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`Cleaned up orphaned file: ${filePath}`);
      return true;
    } catch (err) {
      console.error(`Failed to clean up orphaned file ${filePath}:`, err);
      return false;
    }
  }
  return false;
};

module.exports = {
  handleImageUpload,
  cleanupOrphanedFile,
};
