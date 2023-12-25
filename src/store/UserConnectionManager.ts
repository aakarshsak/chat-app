import { connection } from "websocket";
import { User } from "../models/User";
import { authenticateUsingToken } from "../utils/auth";
import { Store } from "./Store";

export class UserManager {
  users: Map<string, connection>;

  constructor() {
    this.users = new Map<string, connection>();
  }

  init = async (userId: string, conn: connection): Promise<void> => {
    this.users.set(userId, conn);
  };

  getConnection = (userId: string): connection => {
    const conn = this.users.get(userId);
    return conn!;
  };

  clearUsingUserId = (userId: string) => {
    if (this.users.get(userId)) this.users.delete(userId);
  };

  clearUsingConnection = (conn: connection): void => {
    let userId = "";
    for (const [key, value] of this.users.entries()) {
      if (value === conn) userId = key;
    }
    this.clearUsingUserId(userId);
  };
}
