import { Payload } from "../messaging/message";

export default class RelayService {
  private offlineUsers: Map<string, Payload[]>;

  constructor() {
    this.offlineUsers = new Map<string, Payload[]>();
  }

  getSingleUserRecords = (userId: string): Payload[] => {
    const records = this.offlineUsers.get(userId);
    if (!records) return [];
    return records;
  };

  addOfflineUserRecords = (userId: string, payload: Payload) => {
    console.log("Adding to offline", userId, payload);
    let existingRecords = this.offlineUsers.get(userId) as Payload[];
    console.log(existingRecords);
    if (!existingRecords) existingRecords = [];
    existingRecords.push(payload);
    this.offlineUsers.set(userId, existingRecords);
  };

  clearRecordsForUser = (userId: string) => {
    const record = this.getSingleUserRecords(userId);
    if (record.length > 0) this.offlineUsers.delete(userId);
  };
}
