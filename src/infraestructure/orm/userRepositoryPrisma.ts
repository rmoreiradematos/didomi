import { UserEntity } from '@domain/entities/userEntity'
import { PrismaClient } from '@prisma/client'
import { UserRepository } from '@repositories/userRepository'

export class UserRepositoryPrisma implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(email: string): Promise<UserEntity> {
    const prismaUser = await this.prisma.user.create({
      data: { email },
    })
    return this.mapToUserEntity(prismaUser)
  }

  async findById(id: string): Promise<UserEntity | null> {
    return await this.prisma.user.findUnique({
      where: { id },
      include: { consents: true },
    })
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.prisma.user.findMany({ include: { consents: true } })
  }

  async delete(id: string) {
    await this.prisma.user.delete({ where: { id } })
  }

  private mapToUserEntity(prismaUser: any): UserEntity {
    return {
      id: prismaUser.id,
      email: prismaUser.email,
      consents: prismaUser.consents ?? [],
    }
  }
}
