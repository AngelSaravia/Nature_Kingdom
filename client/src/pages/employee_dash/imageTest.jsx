import React, { useState, useEffect } from "react";

const ImageLoadTest = () => {
  // State to track loading status
  const [imageStatus, setImageStatus] = useState({});

  // Test images from different sources
  const testImages = [
    // Test your actual uploaded images (adjust the URL to match your environment)
    "http://localhost:5004/uploads/1745171865309-elephan._plushy.jpg",
    // Test a known public image
    "https://placehold.co/300x200",
    // Test an embedded base64 image from your component
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNlMGUwZTAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZiNmI2YiIgZHk9Ii4zZW0iPlRlc3QgSW1hZ2U8L3RleHQ+PC9zdmc+",
    // Test one of the category placeholder images from your component
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmZmUwYzQiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2M0NjcwMCIgZHk9Ii4zZW0iPlBsdXNoIFRveTwvdGV4dD48L3N2Zz4=",
  ];

  // Simulate the actual API call that might be happening in your app
  const [apiTestResult, setApiTestResult] = useState({
    loading: true,
    error: null,
    url: null,
  });

  useEffect(() => {
    // Simulate API call to get image URL
    const simulateApiCall = async () => {
      try {
        // This simulates the delay of a real API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // For testing, randomly succeed or fail
        const success = Math.random() > 0.3;

        if (success) {
          setApiTestResult({
            loading: false,
            error: null,
            url: "https://placehold.co/300x200/00ff00/ffffff?text=API+Success",
          });
        } else {
          throw new Error("Simulated API error");
        }
      } catch (error) {
        setApiTestResult({
          loading: false,
          error: error.message,
          url: null,
        });
      }
    };

    simulateApiCall();
  }, []);

  // Test actually using your application's image upload function
  const testImageUpload = () => {
    // This is where you could actually call your uploadProductImage function
    // For this demo, we'll just console log
    console.log("Would call uploadProductImage here with a file");
    alert("Check your uploadProductImage function in the browser console");
  };

  const handleImageLoad = (index) => {
    console.log(`Image ${index + 1} loaded successfully`);
    setImageStatus((prev) => ({
      ...prev,
      [index]: { loaded: true, error: false },
    }));
  };

  const handleImageError = (index, e) => {
    console.error(`Image ${index + 1} failed to load`);
    setImageStatus((prev) => ({
      ...prev,
      [index]: { loaded: false, error: true },
    }));

    // Set a fallback image
    e.target.src =
      "https://placehold.co/300x200/ff0000/ffffff?text=Load+Failed";
  };

  return (
    <div
      className="image-test-container"
      style={{ padding: "20px", fontFamily: "sans-serif" }}
    >
      <h1>Image Loading Test</h1>
      <p>
        This page tests various image loading scenarios to debug your GiftDash
        component.
      </p>

      <div style={{ marginBottom: "30px" }}>
        <h2>1. Static Image Tests</h2>
        <p>Testing different image sources to see which ones load correctly:</p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          {testImages.map((src, index) => (
            <div
              key={index}
              style={{
                padding: "15px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                background: "#f9f9f9",
              }}
            >
              <h3>Test Image {index + 1}</h3>
              <div
                style={{
                  fontSize: "12px",
                  marginBottom: "10px",
                  wordBreak: "break-all",
                }}
              >
                <strong>Source:</strong> {src.substring(0, 50)}
                {src.length > 50 ? "..." : ""}
              </div>

              <div
                style={{
                  background: "#fff",
                  padding: "10px",
                  borderRadius: "4px",
                  height: "200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={src}
                  alt={`Test image ${index + 1}`}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "180px",
                    border: imageStatus[index]?.error
                      ? "2px solid red"
                      : imageStatus[index]?.loaded
                      ? "2px solid green"
                      : "1px solid #ddd",
                  }}
                  onLoad={() => handleImageLoad(index)}
                  onError={(e) => handleImageError(index, e)}
                />
              </div>

              <div style={{ marginTop: "10px", textAlign: "center" }}>
                {imageStatus[index]?.loaded && (
                  <span style={{ color: "green" }}>✓ Loaded</span>
                )}
                {imageStatus[index]?.error && (
                  <span style={{ color: "red" }}>✗ Failed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h2>2. API Image Test</h2>
        <p>Testing image loading via simulated API response:</p>

        <div
          style={{
            padding: "15px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            background: "#f9f9f9",
            maxWidth: "400px",
          }}
        >
          {apiTestResult.loading ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              Loading...
            </div>
          ) : apiTestResult.error ? (
            <div style={{ color: "red", padding: "20px" }}>
              Error: {apiTestResult.error}
            </div>
          ) : (
            <div>
              <h3>API-provided image:</h3>
              <div
                style={{
                  background: "#fff",
                  padding: "10px",
                  borderRadius: "4px",
                }}
              >
                <img
                  src={apiTestResult.url}
                  alt="API Result"
                  style={{ maxWidth: "100%" }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h2>3. Debugging Techniques</h2>

        <div
          style={{
            background: "#f0f8ff",
            padding: "15px",
            borderRadius: "5px",
            marginBottom: "20px",
          }}
        >
          <h3>Console Network Tab</h3>
          <p>
            Open your browser's Developer Tools (F12) and check the Network tab
            to see:
          </p>
          <ul>
            <li>If image requests are being made</li>
            <li>The exact URLs being requested</li>
            <li>HTTP status codes for failed requests</li>
          </ul>
        </div>

        <div
          style={{
            background: "#fff8f0",
            padding: "15px",
            borderRadius: "5px",
          }}
        >
          <h3>Common Issues:</h3>
          <ol>
            <li>
              <strong>CORS errors</strong> - The browser may block images from
              different origins
            </li>
            <li>
              <strong>404 Not Found</strong> - The image path is incorrect
            </li>
            <li>
              <strong>Relative vs Absolute paths</strong> - Make sure URLs are
              correctly formatted
            </li>
            <li>
              <strong>Environment variables</strong> - Check if API_BASE_URL is
              set correctly
            </li>
          </ol>
        </div>
      </div>

      <div>
        <h2>4. Fix for Your GiftDash Component</h2>
        <p>Based on your code, try these fixes:</p>

        <div
          style={{
            background: "#f5f5f5",
            padding: "15px",
            borderRadius: "5px",
            marginBottom: "20px",
          }}
        >
          <h3>Option 1: Enable your actual image code</h3>
          <p>
            Remove the <code>false &&</code> condition in your component:
          </p>
          <pre
            style={{
              background: "#333",
              color: "#fff",
              padding: "10px",
              borderRadius: "4px",
            }}
          >
            {`// Change this:
{false && item.imageUrl && (
  <img
    src={item.imageUrl}
    alt={item.name}
    className="product-thumbnail"
  />
)}

// To this:
{item.imageUrl ? (
  <img
    src={item.imageUrl}
    alt={item.name}
    className="product-thumbnail"
    onError={(e) => {
      console.error("Failed to load image:", item.imageUrl);
      e.target.src = CATEGORY_PLACEHOLDERS[item.category?.toLowerCase()] || CATEGORY_PLACEHOLDERS.default;
    }}
  />
) : (
  <img
    src={CATEGORY_PLACEHOLDERS[item.category?.toLowerCase()] || CATEGORY_PLACEHOLDERS.default}
    alt={item.name}
    className="product-thumbnail"
  />
)}`}
          </pre>
        </div>

        <div
          style={{
            background: "#f5f5f5",
            padding: "15px",
            borderRadius: "5px",
          }}
        >
          <h3>Option 2: Test with dynamic fallbacks</h3>
          <p>Use your category placeholders as fallbacks:</p>
          <pre
            style={{
              background: "#333",
              color: "#fff",
              padding: "10px",
              borderRadius: "4px",
            }}
          >
            {`<td className="image-cell">
  <img
    src={item.imageUrl || CATEGORY_PLACEHOLDERS[item.category?.toLowerCase()] || CATEGORY_PLACEHOLDERS.default}
    alt={item.name}
    className="product-thumbnail"
    onError={(e) => {
      e.target.src = CATEGORY_PLACEHOLDERS[item.category?.toLowerCase()] || CATEGORY_PLACEHOLDERS.default;
    }}
  />
</td>`}
          </pre>

          <button
            onClick={testImageUpload}
            style={{
              marginTop: "20px",
              background: "#4CAF50",
              color: "white",
              border: "none",
              padding: "10px 15px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Test Image Upload Function
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageLoadTest;
