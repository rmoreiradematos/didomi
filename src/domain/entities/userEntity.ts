export class UserEntity {
  constructor(
    public id: string,
    public email: string,
  ) {}

  static create(id: string, email: string): UserEntity {
    if (!email.includes('@')) {
      throw new Error('Invalid email address')
    }
    return new UserEntity(id, email)
  }
}
