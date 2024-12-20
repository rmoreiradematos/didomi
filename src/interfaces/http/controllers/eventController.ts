import { CreateEventUseCase } from '@application/useCases/createEvent/createEvent.useCase'
import { EventRepositoryPrisma } from '@infraestructure/orm/eventRepositoryPrisma'
import { UserRepositoryPrisma } from '@infraestructure/orm/userRepositoryPrisma'
import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

export class EventController {
  private eventRepository: EventRepositoryPrisma
  private createEventUseCase: CreateEventUseCase
  private userRepository: UserRepositoryPrisma
  constructor(private prisma: PrismaClient) {
    this.prisma = prisma
    this.eventRepository = new EventRepositoryPrisma(this.prisma)
    this.userRepository = new UserRepositoryPrisma(this.prisma)
    this.createEventUseCase = new CreateEventUseCase(
      this.eventRepository,
      this.userRepository,
    )
  }

  async createEvent(req: Request, res: Response) {
    try {
      const result = await this.createEventUseCase.execute(req.body)
      res.status(201).json(result)
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }
}
