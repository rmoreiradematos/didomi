import { PrismaClient } from '@prisma/client'
import { EventRepository } from '../../domain/repositories/repositoryInterfaces'

export class EventRepositoryPrisma implements EventRepository {
  constructor(private prisma: PrismaClient) {}

  async create(userId: string, consents: any[]): Promise<any> {
    return this.prisma.event.create({
      data: {
        userId,
        consents,
      },
    })
  }

  async findAllByUserId(userId: string): Promise<any[]> {
    return this.prisma.event.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    })
  }
}
