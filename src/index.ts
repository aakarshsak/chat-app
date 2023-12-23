import http from "http";
import app from "./httpServer";
import { init } from "./websocketServer";

const PORT = 8080;

const server = http.createServer();

init(server);

server.on("request", app);

server.listen(PORT, () =>
  console.log(new Date() + " Listening on port " + PORT)
);
