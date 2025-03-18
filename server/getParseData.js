const getParseData = (req) => {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        if (!body) {
          resolve({});
          return;
        }

        const data = JSON.parse(body);
        resolve(data);
      } catch (error) {
        console.error("Error parsing request body:", error, "Body:", body);
        reject(error);
      }
    });
  });
};

module.exports = getParseData;
