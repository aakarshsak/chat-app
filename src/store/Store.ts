import { connection } from "websocket";

export interface Store {
  init(userId: string, name: string, conn: connection): void;
}
