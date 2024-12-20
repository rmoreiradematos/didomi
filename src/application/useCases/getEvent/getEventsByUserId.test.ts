import { GetEventsByUserIdUseCase } from '@application/useCases/getEvent/getEventsByUserId.useCase'
import { GetEventsByUserIdRequestModel } from './getEventsByUserId.requestModel'

describe('GetEventsByUserIdUseCase', () => {
  const mockEventRepository = {
    create: jest.fn(),
    findAllByUserId: jest.fn(),
    findEventByUserIdAndId: jest.fn(),
    edit: jest.fn(),
  }

  it('should return all events for a valid user ID', async () => {
    const useCase = new GetEventsByUserIdUseCase(mockEventRepository)
    const userId = 'user-id-123'
    const request: GetEventsByUserIdRequestModel = { userId }

    const date = new Date()
    const mockEvents = [
      {
        id: 'event-id-1',
        userId: userId,
        consents: [{ id: 'email_notifications', enabled: true }],
        createdAt: date,
      },
      {
        id: 'event-id-2',
        userId: userId,
        consents: [{ id: 'sms_notifications', enabled: false }],
        createdAt: date,
      },
    ]

    mockEventRepository.findAllByUserId.mockResolvedValue(mockEvents)

    const result = await useCase.execute(request)

    const expectedResult = [
      {
        createdAt: date,
        enabled: undefined,
        id: 'event-id-1',
        userId: 'user-id-123',
      },
      {
        createdAt: date,
        enabled: undefined,
        id: 'event-id-2',
        userId: 'user-id-123',
      },
    ]
    expect(mockEventRepository.findAllByUserId).toHaveBeenCalledWith(userId)
    expect(result).toEqual(expectedResult)
  })

  it('should return an empty array if the user has no events', async () => {
    const useCase = new GetEventsByUserIdUseCase(mockEventRepository)
    const userId = 'user-id-456'
    const request: GetEventsByUserIdRequestModel = { userId }

    mockEventRepository.findAllByUserId.mockResolvedValue([])

    const result = await useCase.execute(request)

    expect(mockEventRepository.findAllByUserId).toHaveBeenCalledWith(userId)
    expect(result).toEqual([])
  })

  it('should throw an error if the user ID is not provided', async () => {
    const useCase = new GetEventsByUserIdUseCase(mockEventRepository)
    const request: GetEventsByUserIdRequestModel = { userId: '' }

    await expect(useCase.execute(request)).rejects.toThrow(
      'User ID is required',
    )
  })
})
