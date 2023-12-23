import { connection } from "websocket";
import { User } from "../models/User";
import { Store } from "./Store";

export class UserManager {
  users: Map<string, User>;

  constructor() {
    this.users = new Map<string, User>();
  }

  init = (userId: string, name: string, conn: connection): void => {
    this.users.set(userId, new User(name, userId, conn));
  };

  getUser = (userId: string): User => {
    const user = this.users.get(userId);
    return user!;
  };
}
