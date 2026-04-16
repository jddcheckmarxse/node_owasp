const http = require("node:http");
const { URL } = require("node:url");

const SECURITY_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
  "Content-Security-Policy": "default-src 'none'",
  "Cache-Control": "no-store",
};

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, SECURITY_HEADERS);
  res.end(JSON.stringify(body));
}

function validateName(name) {
  if (typeof name !== "string") {
    return null;
  }

  const trimmed = name.trim();
  const isValid = /^[a-zA-Z0-9 _-]{1,50}$/.test(trimmed);
  return isValid ? trimmed : null;
}

function requestHandler(req, res) {
  try {
    const reqUrl = new URL(req.url || "/", "http://localhost");

    if (req.method === "GET" && reqUrl.pathname === "/health") {
      sendJson(res, 200, { status: "ok" });
      return;
    }

    if (req.method === "GET" && reqUrl.pathname === "/hello") {
      const name = validateName(reqUrl.searchParams.get("name") || "World");

      if (!name) {
        sendJson(res, 400, { error: "Invalid input." });
        return;
      }

      sendJson(res, 200, { message: `Hello, ${name}!` });
      return;
    }

    sendJson(res, 404, { error: "Not found." });
  } catch (_error) {
    sendJson(res, 500, { error: "Unexpected error." });
  }
}

function createServer() {
  return http.createServer(requestHandler);
}

module.exports = {
  createServer,
};
