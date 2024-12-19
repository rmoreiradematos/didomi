import { CreateEventUseCase } from '@application/useCases/createEvent/createEvent.useCase'
import { GetEventsByUserIdUseCase } from '@application/useCases/getEvent/getEventsByUserId.useCase'
import { EventRepositoryPrisma } from '@infraestructure/orm/eventRepositoryPrisma'
import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

export class EventController {
  private eventRepository: EventRepositoryPrisma
  private createEventUseCase: CreateEventUseCase
  private getEventsByUserIdUseCase: GetEventsByUserIdUseCase

  constructor(private prisma: PrismaClient) {
    this.prisma = prisma
    this.eventRepository = new EventRepositoryPrisma(this.prisma)
    this.createEventUseCase = new CreateEventUseCase(this.eventRepository)
    this.getEventsByUserIdUseCase = new GetEventsByUserIdUseCase(
      this.eventRepository,
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

  async getUserEvents(req: Request, res: Response) {
    try {
      const result = await this.getEventsByUserIdUseCase.execute({
        userId: req.params.userId,
      })
      res.json(result)
    } catch (err: any) {
      res.status(404).json({ error: err.message })
    }
  }
}
