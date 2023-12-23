import http from "http";
import app from "./servers/httpServer";
import { config } from "dotenv";
import { initiateSocketConnection } from "./servers/websocketServer";

config();

const PORT = 8080;

const server = http.createServer();

initiateSocketConnection(server);

server.on("request", app);

server.listen(PORT, () =>
  console.log(new Date() + " Listening on port..." + PORT)
);
