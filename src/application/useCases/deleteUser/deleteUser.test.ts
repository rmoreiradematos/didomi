import { DeleteUserRequestModel } from './deleteUser.requestModel'
import { DeleteUserUseCase } from './deleteUser.useCase'

describe('DeleteUserUseCase', () => {
  const mockUserRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    delete: jest.fn(),
  }

  it('should delete a user successfully when the user exists', async () => {
    const useCase = new DeleteUserUseCase(mockUserRepository)
    const userId = 'user-id-123'
    const request: DeleteUserRequestModel = { id: userId }

    mockUserRepository.findById.mockResolvedValue({
      id: userId,
      email: 'test@example.com',
    })
    mockUserRepository.delete.mockResolvedValue(undefined)

    const result = await useCase.execute(request)

    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
    expect(mockUserRepository.delete).toHaveBeenCalledWith(userId)
    expect(result).toEqual({ success: true })
  })

  it('should throw an error when the user does not exist', async () => {
    const useCase = new DeleteUserUseCase(mockUserRepository)
    const userId = 'non-existent-user-id'
    const request: DeleteUserRequestModel = { id: userId }

    mockUserRepository.findById.mockResolvedValue(null)

    await expect(useCase.execute(request)).rejects.toThrow('User not found')
  })
})
