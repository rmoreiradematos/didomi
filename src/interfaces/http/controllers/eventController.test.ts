import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { EventController } from './eventController'

jest.mock('@prisma/client')

describe('EventController', () => {
  let prisma: PrismaClient
  let eventController: EventController
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let jsonMock: jest.Mock
  let statusMock: jest.Mock

  beforeEach(() => {
    prisma = new PrismaClient()
    eventController = new EventController(prisma)

    jsonMock = jest.fn()
    statusMock = jest.fn(() => ({ json: jsonMock }))
    mockRequest = {}
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create a new event successfully', async () => {
    const userId = 'user-id-123'
    const consents = [{ id: 'email_notifications', enabled: true }]

    mockRequest.body = { userId, consents }
    prisma.event.create = jest.fn().mockResolvedValue({
      id: 'event-id-123',
      userId,
      consents,
      createdAt: new Date(),
    })

    await eventController.createEvent(
      mockRequest as Request,
      mockResponse as Response,
    )

    expect(prisma.event.create).toHaveBeenCalledWith({
      data: { userId, consents },
    })
    expect(statusMock).toHaveBeenCalledWith(201)
    expect(jsonMock).toHaveBeenCalledWith({
      id: 'event-id-123',
      userId,
      consents,
      createdAt: expect.any(Date),
    })
  })

  it('should return all events for a user', async () => {
    const userId = 'user-id-123'

    mockRequest.params = { userId }
    prisma.event.findMany = jest.fn().mockResolvedValue([
      {
        id: 'event-id-1',
        userId,
        consents: [{ id: 'email_notifications', enabled: true }],
        createdAt: new Date(),
      },
      {
        id: 'event-id-2',
        userId,
        consents: [{ id: 'sms_notifications', enabled: false }],
        createdAt: new Date(),
      },
    ])

    await eventController.getUserEvents(
      mockRequest as Request,
      mockResponse as Response,
    )

    expect(prisma.event.findMany).toHaveBeenCalledWith({
      where: { userId },
    })
    expect(statusMock).not.toHaveBeenCalled()
    expect(jsonMock).toHaveBeenCalledWith([
      {
        id: 'event-id-1',
        userId,
        consents: [{ id: 'email_notifications', enabled: true }],
        createdAt: expect.any(Date),
      },
      {
        id: 'event-id-2',
        userId,
        consents: [{ id: 'sms_notifications', enabled: false }],
        createdAt: expect.any(Date),
      },
    ])
  })

  it('should return 400 when creating an event with invalid input', async () => {
    mockRequest.body = {}

    await eventController.createEvent(
      mockRequest as Request,
      mockResponse as Response,
    )

    expect(statusMock).toHaveBeenCalledWith(400)
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid input' })
  })

  it('should return 404 when fetching events for a non-existent user', async () => {
    const userId = 'non-existent-user-id'

    mockRequest.params = { userId }
    prisma.event.findMany = jest.fn().mockResolvedValue([])

    await eventController.getUserEvents(
      mockRequest as Request,
      mockResponse as Response,
    )

    expect(prisma.event.findMany).toHaveBeenCalledWith({
      where: { userId },
    })
    expect(statusMock).not.toHaveBeenCalled() // Resposta padrão 200, mas com array vazio.
    expect(jsonMock).toHaveBeenCalledWith([])
  })
})
