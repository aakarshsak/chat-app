import { connection } from "websocket";
import { User } from "../models/User";
import { authenticateUsingToken } from "../utils/auth";
import { Store } from "./Store";

export class UserManager {
  users: Map<string, User>;

  constructor() {
    this.users = new Map<string, User>();
  }

  init = async (userId: string, conn: connection): Promise<void> => {
    this.users.set(userId, new User(userId, conn));
  };

  getUser = (userId: string): User => {
    const user = this.users.get(userId);
    return user!;
  };
}
