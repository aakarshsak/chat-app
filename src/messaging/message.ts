import { connection, IUtf8Message } from "websocket";
import { User } from "../db/db";
import CustomError from "../errors/CustomError";
import { UserConnectionManager } from "../store/UserConnectionManager";
import RelayService from "../utils/RelayService";

const DIRECT_MESSAGE = "DIRECT_MESSAGE";
const GROUP_MESSAGE = "GROUP_MESSAGE";

enum MessageType {
  DirectMessage = "DIRECT_MESSAGE",
  GroupMessage = "GROUP_MESSAGE",
}

export type Payload = {
  from: string;
  to: string;
  msg: string;
  timestamp: number;
};

type IncomingMessage = {
  type: MessageType;
  payload: Payload;
};

const relay = new RelayService();

export const messageHandler = async (
  conn: connection,
  message: IncomingMessage,
  userManager: UserConnectionManager
) => {
  if (message.type === MessageType.DirectMessage) {
    // const me = conn.sendUTF(message.payload.from + ": " + message.payload.msg);
    try {
      message.payload.timestamp = Date.now();
      const toConnection = userManager.getConnection(message.payload.to);
      // console.log("37", );
      const dbUser = await User.findOne({ username: message.payload.to });
      console.log("39", dbUser);
      if (toConnection) {
        const date = new Date(message.payload.timestamp);
        const time =
          date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        toConnection.sendUTF(
          time + " => " + message.payload.from + ": " + message.payload.msg
        );
      } else if (dbUser) {
        relay.addOfflineUserRecords(
          dbUser?.username as string,
          message.payload
        );
      } else {
        throw new CustomError("Invalid Recipient userid", 400);
      }
    } catch (err) {
      throw err;
    }
  } else {
    throw new Error("Invalid Message type");
  }
};

export const retrieveMessagesWhileOffline = (
  userId: string,
  conn: connection
) => {
  const records = relay.getSingleUserRecords(userId);
  console.log(records);
  if (records.length <= 0) return;
  const sortedRecords = records.sort((a, b) => a.timestamp - b.timestamp);
  sortedRecords.forEach((r) => {
    const date = new Date(r.timestamp);
    const time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    conn.sendUTF(time + " => " + r.from + " : " + r.msg);
  });
  relay.clearRecordsForUser(userId);
};
