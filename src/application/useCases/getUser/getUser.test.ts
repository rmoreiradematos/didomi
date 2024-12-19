import { GetUserUseCase } from '@application/useCases/getUser/getUser.useCase'
import { GetUserRequestModel } from './getUser.requestModel'

describe('GetUserUseCase', () => {
  const mockUserRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    delete: jest.fn(),
  }

  it('should return a user for a valid ID', async () => {
    const useCase = new GetUserUseCase(mockUserRepository)
    const userId = 'user-id-123'
    const request: GetUserRequestModel = { id: userId }

    const mockUser = {
      id: userId,
      email: 'test@example.com',
      consents: [{ id: 'email_notifications', enabled: true }],
    }

    mockUserRepository.findById.mockResolvedValue(mockUser)

    const result = await useCase.execute(request)

    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
    expect(result).toEqual(mockUser)
  })

  it('should throw an error if the user does not exist', async () => {
    const useCase = new GetUserUseCase(mockUserRepository)
    const userId = 'non-existent-user-id'
    const request: GetUserRequestModel = { id: userId }

    mockUserRepository.findById.mockResolvedValue(null)

    await expect(useCase.execute(request)).rejects.toThrow('User not found')

    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
  })

  it('should throw an error if no ID is provided', async () => {
    const useCase = new GetUserUseCase(mockUserRepository)
    const request: GetUserRequestModel = { id: '' }

    await expect(useCase.execute(request)).rejects.toThrow(
      'User ID is required',
    )

    expect(mockUserRepository.findById).not.toHaveBeenCalled()
  })
})
