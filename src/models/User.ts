import { connection } from "websocket";

export class User {
  private name: string;
  private userId: string;
  private conn: connection;

  constructor(name: string, userId: string, conn: connection) {
    this.name = name;
    this.userId = userId;
    this.conn = conn;
  }

  public getName = (): string => this.name;

  public setName = (name: string): void => {
    this.name = name;
  };

  public getUserId = (): string => this.userId;

  public setUserId = (userId: string): void => {
    this.userId = userId;
  };

  public getConn = (): connection => this.conn;
}
