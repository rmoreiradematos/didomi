import { GetUserUseCase } from '@application/useCases/getUser/getUser.useCase'
import { GetUserRequestModel } from './getUser.requestModel'

describe('GetUserUseCase', () => {
  const mockUserRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    delete: jest.fn(),
  }
  const mockEventRepository = {
    create: jest.fn(),
    findAllByUserId: jest.fn(),
    findEventByUserIdAndId: jest.fn(),
    edit: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return all users with their consents', async () => {
    const useCase = new GetUserUseCase(mockUserRepository, mockEventRepository)

    const mockUsers = [
      { id: 'user-id-1', email: 'user1@example.com', consents: [] },
      { id: 'user-id-2', email: 'user2@example.com', consents: [] },
    ]

    const mockConsentsUser1 = [{ id: 'email_notifications', enabled: true }]
    const mockConsentsUser2 = [{ id: 'sms_notifications', enabled: false }]

    mockUserRepository.findAll.mockResolvedValue(mockUsers)
    mockEventRepository.findAllByUserId
      .mockResolvedValueOnce(mockConsentsUser1)
      .mockResolvedValueOnce(mockConsentsUser2)

    const result = await useCase.executeAll()

    expect(mockUserRepository.findAll).toHaveBeenCalled()
    expect(mockEventRepository.findAllByUserId).toHaveBeenCalledWith(
      'user-id-1',
    )
    expect(mockEventRepository.findAllByUserId).toHaveBeenCalledWith(
      'user-id-2',
    )
    expect(result).toEqual([
      {
        id: 'user-id-1',
        email: 'user1@example.com',
        consents: mockConsentsUser1,
      },
      {
        id: 'user-id-2',
        email: 'user2@example.com',
        consents: mockConsentsUser2,
      },
    ])
  })

  it('should handle an empty user list gracefully', async () => {
    const useCase = new GetUserUseCase(mockUserRepository, mockEventRepository)

    mockUserRepository.findAll.mockResolvedValue([])

    const result = await useCase.executeAll()

    expect(mockUserRepository.findAll).toHaveBeenCalled()
    expect(mockEventRepository.findAllByUserId).not.toHaveBeenCalled()
    expect(result).toEqual([])
  })

  it('should throw an error if an event repository fails', async () => {
    const useCase = new GetUserUseCase(mockUserRepository, mockEventRepository)

    const mockUsers = [
      { id: 'user-id-1', email: 'user1@example.com', consents: [] },
    ]

    mockUserRepository.findAll.mockResolvedValue(mockUsers)
    mockEventRepository.findAllByUserId.mockRejectedValue(
      new Error('Event repository failure'),
    )

    await expect(useCase.executeAll()).rejects.toThrow(
      'Event repository failure',
    )
    expect(mockUserRepository.findAll).toHaveBeenCalled()
    expect(mockEventRepository.findAllByUserId).toHaveBeenCalledWith(
      'user-id-1',
    )
  })

  it('should return an error when id is not provided', async () => {
    const useCase = new GetUserUseCase(mockUserRepository, mockEventRepository)

    await expect(useCase.execute({ id: '' })).rejects.toThrow(
      'User ID is required',
    )
  })

  it('should throw an error if the user is not found', async () => {
    const useCase = new GetUserUseCase(mockUserRepository, mockEventRepository)
    const request: GetUserRequestModel = { id: 'non-existent-user-id' }

    mockUserRepository.findById.mockResolvedValue(null)

    await expect(useCase.execute(request)).rejects.toThrow('User not found')

    expect(mockUserRepository.findById).toHaveBeenCalledWith(
      'non-existent-user-id',
    )
    expect(mockEventRepository.findAllByUserId).not.toHaveBeenCalled()
  })
})
