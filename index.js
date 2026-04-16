const { createServer } = require("./src/server");

const port = Number(process.env.PORT) || 3000;
const host = "0.0.0.0";

const server = createServer();
server.listen(port, host, () => {
  process.stdout.write(`Server listening on http://${host}:${port}\n`);
});
