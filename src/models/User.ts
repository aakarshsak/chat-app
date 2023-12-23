import { connection } from "websocket";

export class User {
  private userId: string;
  private conn: connection;

  constructor(userId: string, conn: connection) {
    this.userId = userId;
    this.conn = conn;
  }

  public getUserId = (): string => this.userId;

  public setUserId = (userId: string): void => {
    this.userId = userId;
  };

  public getConn = (): connection => this.conn;
}
