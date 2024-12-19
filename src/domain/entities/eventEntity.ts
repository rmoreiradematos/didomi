export class EventEntity {
  constructor(
    public id: string,
    public userId: string,
    public consents: any,
    public createdAt: Date,
  ) {}
}
