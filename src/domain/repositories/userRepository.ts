import { UserEntity } from '@domain/entities/userEntity'

export interface UserRepository {
  create(email: string): Promise<UserEntity>
  findById(id: string): Promise<UserEntity | null>
  findAll(): Promise<UserEntity[]>
  delete(id: string): Promise<void>
}
