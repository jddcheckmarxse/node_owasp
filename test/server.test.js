const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { createServer } = require("../src/server");

function request(port, path) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        method: "GET",
        host: "127.0.0.1",
        port,
        path,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          let parsedBody;
          try {
            parsedBody = JSON.parse(data);
          } catch (error) {
            reject(new Error(`Failed to parse JSON response: ${error.message}`));
            return;
          }
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: parsedBody,
          });
        });
      },
    );
    req.on("error", reject);
    req.end();
  });
}

test("health endpoint returns status and security headers", async () => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();

  try {
    const response = await request(port, "/health");
    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.body, { status: "ok" });
    assert.equal(response.headers["x-content-type-options"], "nosniff");
    assert.equal(response.headers["x-frame-options"], "DENY");
  } finally {
    await new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  }
});

test("hello endpoint rejects unsafe input", async () => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();

  try {
    const response = await request(port, "/hello?name=<script>alert(1)</script>");
    assert.equal(response.statusCode, 400);
    assert.deepEqual(response.body, { error: "Invalid input." });
  } finally {
    await new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  }
});

test("hello endpoint accepts valid input", async () => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();

  try {
    const response = await request(port, "/hello?name=Alice");
    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.body, { message: "Hello, Alice!" });
  } finally {
    await new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  }
});
