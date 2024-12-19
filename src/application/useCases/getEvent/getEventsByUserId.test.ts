import { GetEventsByUserIdUseCase } from '@application/useCases/getEvent/getEventsByUserId.useCase'
import { GetEventsByUserIdRequestModel } from './getEventsByUserId.requestModel'

describe('GetEventsByUserIdUseCase', () => {
  const mockEventRepository = {
    create: jest.fn(),
    findAllByUserId: jest.fn(),
  }

  it('should return all events for a valid user ID', async () => {
    const useCase = new GetEventsByUserIdUseCase(mockEventRepository)
    const userId = 'user-id-123'
    const request: GetEventsByUserIdRequestModel = { userId }

    const mockEvents = [
      {
        id: 'event-id-1',
        userId: userId,
        consents: [{ id: 'email_notifications', enabled: true }],
        createdAt: new Date(),
      },
      {
        id: 'event-id-2',
        userId: userId,
        consents: [{ id: 'sms_notifications', enabled: false }],
        createdAt: new Date(),
      },
    ]

    mockEventRepository.findAllByUserId.mockResolvedValue(mockEvents)

    const result = await useCase.execute(request)

    expect(mockEventRepository.findAllByUserId).toHaveBeenCalledWith(userId)
    expect(result).toEqual(mockEvents)
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

  it('should throw an error if userId is not provided', async () => {
    const useCase = new GetEventsByUserIdUseCase(mockEventRepository)
    const request: GetEventsByUserIdRequestModel = { userId: '' }

    await expect(useCase.execute(request)).rejects.toThrow(
      'User ID is required',
    )

    expect(mockEventRepository.findAllByUserId).not.toHaveBeenCalled()
  })
})
