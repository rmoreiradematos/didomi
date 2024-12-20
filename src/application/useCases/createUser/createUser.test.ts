import { CreateUserRequestModel } from './createUser.requestModel'
import { CreateUserUseCase } from './createUser.useCase'

describe('CreateUserUseCase', () => {
  const mockUserRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    delete: jest.fn(),
  }

  it('should create a user with a valid email', async () => {
    const useCase = new CreateUserUseCase(mockUserRepository)
    const email = 'test@example.com'
    const request: CreateUserRequestModel = { email }

    mockUserRepository.create.mockResolvedValue({ id: '123', email })

    const result = await useCase.execute(request)

    expect(mockUserRepository.create).toHaveBeenCalledWith(email)
    expect(result).toEqual({ id: '123', email })
  })

  it('should throw an error for an invalid email', async () => {
    const useCase = new CreateUserUseCase(mockUserRepository)
    const request: CreateUserRequestModel = { email: 'invalid-email' }

    await expect(useCase.execute(request)).rejects.toThrow(
      'Invalid email format',
    )
  })

  it('should throw an error when email is not provided', async () => {
    const useCase = new CreateUserUseCase(mockUserRepository)
    const request: CreateUserRequestModel = { email: '' }

    await expect(useCase.execute(request)).rejects.toThrow(
      'Invalid payload: "email" is required and must be a string',
    )
  })
})
