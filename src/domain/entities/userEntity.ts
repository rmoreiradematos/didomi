export class UserEntity {
  constructor(
    public id: string,
    public email: string,
    public consents: any[] = [],
  ) {}

  static create(id: string, email: string, consents?: any[]): UserEntity {
    if (!email.includes('@')) {
      throw new Error('Invalid email address')
    }
    return new UserEntity(id, email, consents)
  }
}
