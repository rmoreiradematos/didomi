export class EventEntity {
  constructor(
    public id: string,
    public userId: string,
    public enabled: boolean,
    public createdAt: Date,
  ) {}
}

export class EventUpdateInput {
  constructor(
    public id?: string,
    public userId?: string,
    public enabled?: boolean,
  ) {}
}
