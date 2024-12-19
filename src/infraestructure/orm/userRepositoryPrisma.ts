import { UserEntity } from '@domain/entities/userEntity'
import { UserRepository } from '@domain/repositories/repositoryInterfaces'
import { PrismaClient } from '@prisma/client'

export class UserRepositoryPrisma implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(email: string): Promise<UserEntity> {
    return await this.prisma.user.create({ data: { email } })
  }

  async findById(id: string): Promise<UserEntity | null> {
    return await this.prisma.user.findUnique({
      where: { id },
      include: { events: true },
    })
  }

  async findAll() {
    return await this.prisma.user.findMany({ include: { events: true } })
  }

  async delete(id: string) {
    await await this.prisma.user.delete({ where: { id } })
  }
}
