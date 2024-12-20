import { CreateEventUseCase } from '@application/useCases/createEvent/createEvent.useCase'
import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { EventController } from './eventController'

jest.mock('@application/useCases/createEvent/createEvent.useCase')
jest.mock('@infraestructure/orm/eventRepositoryPrisma')
jest.mock('@infraestructure/orm/userRepositoryPrisma')

describe('EventController', () => {
  let prisma: PrismaClient
  let eventController: EventController
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let statusMock: jest.Mock
  let jsonMock: jest.Mock

  beforeEach(() => {
    prisma = new PrismaClient()
    eventController = new EventController(prisma)

    statusMock = jest.fn()
    jsonMock = jest.fn()
    mockRequest = {}
    mockResponse = {
      status: statusMock.mockReturnValue({ json: jsonMock }),
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create a new event successfully', async () => {
    const mockEventData = {
      userId: 'user-id-123',
      id: 'event-id-123',
      enabled: true,
    }

    ;(CreateEventUseCase.prototype.execute as jest.Mock).mockResolvedValue({
      ...mockEventData,
      createdAt: new Date(),
    })

    mockRequest.body = mockEventData

    await eventController.createEvent(
      mockRequest as Request,
      mockResponse as Response,
    )

    expect(CreateEventUseCase.prototype.execute).toHaveBeenCalledWith(
      mockEventData,
    )
    expect(statusMock).toHaveBeenCalledWith(201)
    expect(jsonMock).toHaveBeenCalledWith({
      ...mockEventData,
      createdAt: expect.any(Date),
    })
  })

  it('should return 400 and an error message if event creation fails', async () => {
    const mockEventData = {
      userId: 'user-id-123',
      id: 'event-id-123',
      enabled: true,
    }

    ;(CreateEventUseCase.prototype.execute as jest.Mock).mockRejectedValue(
      new Error('Event creation failed'),
    )

    mockRequest.body = mockEventData

    await eventController.createEvent(
      mockRequest as Request,
      mockResponse as Response,
    )

    expect(CreateEventUseCase.prototype.execute).toHaveBeenCalledWith(
      mockEventData,
    )
    expect(statusMock).toHaveBeenCalledWith(400)
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Event creation failed',
    })
  })
})
