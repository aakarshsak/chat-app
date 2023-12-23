import {
  server as WebSocketServer,
  client as WebSocketClient,
  connection,
} from "websocket";
import { Server } from "http";

import { UserManager } from "./store/UserManager";
import { messageHandler } from "./messaging/message";

const userManager = new UserManager();

export const init = (server: Server) => {
  const ws = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false,
  });

  const originIsAllowed = (origin: string) => true;

  ws.on("request", (req) => {
    console.log("Inside connect..");
    if (!originIsAllowed(req.origin)) {
      req.reject();
      console.log(
        new Date() + " Connection from origin " + req.origin + " rejected."
      );
      return;
    }

    console.log(req.resourceURL.query);
    const userId = req.resourceURL.query?.userId ?? "test123";

    const connection = req.accept("echo-protocol", req.origin);

    console.log(userId.toString());
    userManager.init(userId.toString(), "", connection);

    console.log(new Date() + " Connection acccepted...");
    connection.on("message", function (message) {
      if (message.type === "utf8") {
        //   console.log(store.users);
        console.log("Received Message: " + message.utf8Data);
        try {
          messageHandler(connection, JSON.parse(message.utf8Data), userManager);
        } catch (e) {
          console.error(e);
        }
      }
    });
    connection.on("close", function (reasonCode, description) {
      console.log(
        new Date() + " Peer " + connection.remoteAddress + " disconnected."
      );
    });
  });
};
