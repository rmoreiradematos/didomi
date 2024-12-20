import { PrismaClient } from '@prisma/client'
import { EventRepository } from '@repositories/eventRepository'

export class EventRepositoryPrisma implements EventRepository {
  constructor(private prisma: PrismaClient) {}

  async create(userId: string, id: string, enabled: boolean) {
    const exists = await this.prisma.event.findUnique({
      where: {
        id_userId: {
          id,
          userId,
        },
      },
    })

    if (exists) {
      throw new Error('Event already exists')
    }

    return this.prisma.event.create({
      data: {
        id,
        userId,
        enabled,
      },
    })
  }

  async findAllByUserId(userId: string) {
    return this.prisma.event.findMany({ where: { userId } })
  }

  async findEventByUserIdAndId(userId: string, id: string) {
    return this.prisma.event.findFirst({ where: { userId, id } })
  }

  async edit(event: { id: string; userId: string; enabled: boolean }) {
    return this.prisma.event.update({
      where: {
        id_userId: {
          id: event.id,
          userId: event.userId,
        },
      },
      data: { enabled: event.enabled },
    })
  }
}
