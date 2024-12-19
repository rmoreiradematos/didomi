import { CreateEventUseCase } from '@application/useCases/createEvent/createEvent.useCase'

describe('CreateEventUseCase', () => {
  const mockEventRepository = {
    create: jest.fn(),
    findAllByUserId: jest.fn(),
  }

  it('should create an event successfully', async () => {
    const useCase = new CreateEventUseCase(mockEventRepository)
    const request = {
      userId: 'user-id-123',
      consents: [{ id: 'email_notifications', enabled: true }],
    }

    mockEventRepository.create.mockResolvedValue({
      id: 'event-id-123',
      userId: 'user-id-123',
      consents: request.consents,
      createdAt: new Date(),
    })

    const result = await useCase.execute(request)

    expect(mockEventRepository.create).toHaveBeenCalledWith(
      request.userId,
      request.consents,
    )
    expect(result).toHaveProperty('id', 'event-id-123')
  })

  it('should throw an error for missing userId', async () => {
    const useCase = new CreateEventUseCase(mockEventRepository)
    const request = {
      userId: '',
      consents: [{ id: 'email_notifications', enabled: true }],
    }

    await expect(useCase.execute(request)).rejects.toThrow(
      'User ID is required',
    )
  })
})
