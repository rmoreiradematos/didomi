import { CreateEventUseCase } from '@application/useCases/createEvent/createEvent.useCase'

describe('CreateEventUseCase', () => {
  const mockEventRepository = {
    create: jest.fn(),
    findAllByUserId: jest.fn(),
    findEventByUserIdAndId: jest.fn(),
    edit: jest.fn(),
  }
  const mockUserRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    delete: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create an event successfully', async () => {
    const useCase = new CreateEventUseCase(
      mockEventRepository,
      mockUserRepository,
    )
    const request = {
      id: 'sms_notifications',
      userId: 'user-id-123',
    }

    mockEventRepository.create.mockResolvedValue({
      id: 'sms_notifications',
      userId: 'user-id-123',
    })

    const result = await useCase.execute(request)

    expect(mockEventRepository.create).toHaveBeenCalledWith(
      request.userId,
      request.id,
      true,
    )
    expect(result).toHaveProperty('id', 'sms_notifications')
  })

  it('should throw an error when the event ID is invalid', async () => {
    const useCase = new CreateEventUseCase(
      mockEventRepository,
      mockUserRepository,
    )
    const request = {
      id: 'invalid_id',
      userId: 'user-id-123',
    }

    await expect(useCase.execute(request)).rejects.toThrow('Invalid event ID')
  })

  it('should throw a ValidationError if userId is not provided', async () => {
    const useCase = new CreateEventUseCase(
      mockEventRepository,
      mockUserRepository,
    )
    const request = {
      id: 'sms_notifications',
      userId: '',
    }

    await expect(useCase.execute(request)).rejects.toThrow(
      'User ID is required',
    )
  })

  it('should disable the last consent if the user has preexisting consents', async () => {
    const useCase = new CreateEventUseCase(
      mockEventRepository,
      mockUserRepository,
    )
    const request = {
      id: 'email_notifications',
      userId: 'user-id-123',
    }

    const mockLastConsent = {
      id: 'last-consent-id',
      userId: request.userId,
      enabled: true,
    }

    mockUserRepository.findById.mockResolvedValue({
      id: request.userId,
      email: 'user@example.com',
      consents: [mockLastConsent],
    })

    mockEventRepository.create.mockResolvedValue({
      id: 'email_notifications',
      userId: 'user-id-123',
      enabled: true,
      createdAt: new Date(),
    })

    const result = await useCase.execute(request)

    expect(mockUserRepository.findById).toHaveBeenCalledWith(request.userId)
    expect(mockEventRepository.edit).toHaveBeenCalledWith({
      ...mockLastConsent,
      enabled: false,
    })
    expect(mockEventRepository.create).toHaveBeenCalledWith(
      request.userId,
      request.id,
      true,
    )
    expect(result).toHaveProperty('id', 'email_notifications')
  })
})
