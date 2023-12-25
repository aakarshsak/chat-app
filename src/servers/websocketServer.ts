import {
  server as WebSocketServer,
  client as WebSocketClient,
  connection,
} from "websocket";
import { Server } from "http";

import { UserConnectionManager } from "../store/UserConnectionManager";
import {
  messageHandler,
  retrieveMessagesWhileOffline,
} from "../messaging/message";
import { authenticateUsingToken } from "../utils/auth";

const userManager = new UserConnectionManager();

export const initiateSocketConnection = (server: Server) => {
  const ws = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false,
  });

  const originIsAllowed = (origin: string) => true;

  // User joins / comes online
  const connect = async (req: any): Promise<connection> => {
    const token = req.resourceURL.query?.token as string;
    const userId = await authenticateUsingToken(token);
    const conn = req.accept(req.origin);
    userManager.init(userId, conn);

    console.log(new Date() + " Connection acccepted...");

    retrieveMessagesWhileOffline(userId, conn);

    return Promise.resolve(conn);
  };

  ws.on("request", async (req) => {
    console.log("Inside connect..");

    if (!originIsAllowed(req.origin)) {
      req.reject();
      console.log(
        new Date() + " Connection from origin " + req.origin + " rejected."
      );
      return;
    }

    let connection: connection;

    try {
      connection = await connect(req);
    } catch (err) {
      req.reject();
      console.log(
        new Date() + " Connection from origin " + req.origin + " rejected."
      );
      return;
    }

    connection.on("message", async (message) => {
      if (message.type === "utf8") {
        //   console.log(store.users);
        console.log("Received Message: " + message.utf8Data);
        try {
          await messageHandler(
            connection,
            JSON.parse(message.utf8Data),
            userManager
          );
        } catch (e) {
          console.error(e);
        }
      }
    });
    connection.on("close", function (reasonCode, description) {
      userManager.clearUsingConnection(connection);
      console.log(
        new Date() + " Peer " + connection.remoteAddress + " disconnected."
      );
    });
  });
};
