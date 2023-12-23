import { connection, IUtf8Message } from "websocket";
import { UserManager } from "../store/UserManager";

const DIRECT_MESSAGE = "DIRECT_MESSAGE";
const GROUP_MESSAGE = "GROUP_MESSAGE";

enum MessageType {
  DirectMessage = "DIRECT_MESSAGE",
  GroupMessage = "GROUP_MESSAGE",
}

type Payload = {
  from: string;
  to: string;
  msg: string;
};

type IncomingMessage = {
  type: MessageType;
  payload: Payload;
};

export const messageHandler = (
  conn: connection,
  message: IncomingMessage,
  userManager: UserManager
) => {
  if (message.type === MessageType.DirectMessage) {
    // const me = conn.sendUTF(message.payload.from + ": " + message.payload.msg);
    const user = userManager.getUser(message.payload.to);
    user.getConn().sendUTF(message.payload.from + ": " + message.payload.msg);
  } else {
    throw new Error("Invalid Message type");
  }
};
