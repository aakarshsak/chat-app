export default class LastSeenService {
  private map: Map<string, string>;

  constructor() {
    this.map = new Map<string, string>();
  }

  getUserLastSeen = (userId: string): string | undefined => {
    return this.map.get(userId);
  };

  addUserLastSeen = (userId: string) => {
    this.map.set(userId, Date.now().toString());
  };

  addUserOnline = (userId: string) => {
    this.map.set(userId, "online");
  };
}
