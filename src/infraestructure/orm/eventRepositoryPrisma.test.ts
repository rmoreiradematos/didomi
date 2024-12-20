import { PrismaClient } from '@prisma/client'
import { EventRepositoryPrisma } from './eventRepositoryPrisma'

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    event: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  })),
}))

describe('EventRepositoryPrisma', () => {
  let prisma: PrismaClient
  let eventRepository: EventRepositoryPrisma

  beforeEach(() => {
    prisma = new PrismaClient()
    eventRepository = new EventRepositoryPrisma(prisma)
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create a new event if it does not already exist', async () => {
      const userId = 'user-id-123'
      const id = 'email_notifications'
      const enabled = true

      ;(prisma.event.findUnique as jest.Mock).mockResolvedValue(null)
      ;(prisma.event.create as jest.Mock).mockResolvedValue({
        id,
        userId,
        enabled,
        createdAt: new Date(),
      })

      const result = await eventRepository.create(userId, id, enabled)

      expect(prisma.event.findUnique).toHaveBeenCalledWith({
        where: {
          id_userId: { id, userId },
        },
      })
      expect(prisma.event.create).toHaveBeenCalledWith({
        data: { id, userId, enabled },
      })
      expect(result).toEqual({
        id,
        userId,
        enabled,
        createdAt: expect.any(Date),
      })
    })

    it('should throw an error if the event already exists', async () => {
      const userId = 'user-id-123'
      const id = 'email_notifications'
      const enabled = true

      ;(prisma.event.findUnique as jest.Mock).mockResolvedValue({
        id,
        userId,
        enabled,
      })

      await expect(eventRepository.create(userId, id, enabled)).rejects.toThrow(
        'Event already exists',
      )

      expect(prisma.event.findUnique).toHaveBeenCalledWith({
        where: {
          id_userId: { id, userId },
        },
      })
      expect(prisma.event.create).not.toHaveBeenCalled()
    })
  })

  describe('findAllByUserId', () => {
    it('should return all events for a given user ID', async () => {
      const userId = 'user-id-123'
      const mockEvents = [
        { id: 'event-id-1', userId, enabled: true },
        { id: 'event-id-2', userId, enabled: false },
      ]

      ;(prisma.event.findMany as jest.Mock).mockResolvedValue(mockEvents)

      const result = await eventRepository.findAllByUserId(userId)

      expect(prisma.event.findMany).toHaveBeenCalledWith({
        where: { userId },
      })
      expect(result).toEqual(mockEvents)
    })
  })

  describe('findEventByUserIdAndId', () => {
    it('should return the correct event for the given user ID and event ID', async () => {
      const userId = 'user-id-123'
      const id = 'event-id-1'
      const mockEvent = { id, userId, enabled: true }

      ;(prisma.event.findFirst as jest.Mock).mockResolvedValue(mockEvent)

      const result = await eventRepository.findEventByUserIdAndId(userId, id)

      expect(prisma.event.findFirst).toHaveBeenCalledWith({
        where: { userId, id },
      })
      expect(result).toEqual(mockEvent)
    })

    it('should return null if the event is not found', async () => {
      const userId = 'user-id-123'
      const id = 'event-id-1'

      ;(prisma.event.findFirst as jest.Mock).mockResolvedValue(null)

      const result = await eventRepository.findEventByUserIdAndId(userId, id)

      expect(prisma.event.findFirst).toHaveBeenCalledWith({
        where: { userId, id },
      })
      expect(result).toBeNull()
    })
  })

  describe('edit', () => {
    it('should update an event with the new data', async () => {
      const event = {
        id: 'event-id-123',
        userId: 'user-id-123',
        enabled: false,
      }

      ;(prisma.event.update as jest.Mock).mockResolvedValue({
        ...event,
        enabled: true,
      })

      const result = await eventRepository.edit({
        id: event.id,
        userId: event.userId,
        enabled: true,
      })

      expect(prisma.event.update).toHaveBeenCalledWith({
        where: {
          id_userId: { id: event.id, userId: event.userId },
        },
        data: { enabled: true },
      })
      expect(result).toEqual({
        ...event,
        enabled: true,
      })
    })
  })
})
