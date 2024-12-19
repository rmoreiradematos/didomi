import { EventRepository } from '@domain/repositories/repositoryInterfaces'
import { PrismaClient } from '@prisma/client'

export class EventRepositoryPrisma implements EventRepository {
  constructor(private prisma: PrismaClient) {}

  async create(userId: string, consents: any) {
    return this.prisma.event.create({
      data: {
        userId,
        consents,
      },
    })
  }

  async findAllByUserId(userId: string) {
    return this.prisma.event.findMany({ where: { userId } })
  }
}
