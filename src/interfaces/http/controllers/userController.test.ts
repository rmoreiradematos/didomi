import { CreateUserUseCase } from '@application/useCases/createUser/createUser.useCase'
import { DeleteUserUseCase } from '@application/useCases/deleteUser/deleteUser.useCase'
import { GetUserUseCase } from '@application/useCases/getUser/getUser.useCase'
import { Request, Response } from 'express'
import { UserController } from './userController'

jest.mock('@application/useCases/createUser/createUser.useCase')
jest.mock('@application/useCases/deleteUser/deleteUser.useCase')
jest.mock('@application/useCases/getUser/getUser.useCase')

describe('UserController', () => {
  let userController: UserController
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let statusMock: jest.Mock
  let jsonMock: jest.Mock

  beforeEach(() => {
    const userRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    }
    const eventRepository = {
      create: jest.fn(),
      findAllByUserId: jest.fn(),
      findEventByUserIdAndId: jest.fn(),
      edit: jest.fn(),
    }
    userController = new UserController(userRepository, eventRepository)

    statusMock = jest.fn()
    jsonMock = jest.fn()
    mockRequest = {}
    mockResponse = {
      status: statusMock.mockReturnValue({ json: jsonMock }),
      json: jsonMock,
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const mockUserData = { email: 'test@example.com', id: 'user-id-123' }

      ;(CreateUserUseCase.prototype.execute as jest.Mock).mockResolvedValue(
        mockUserData,
      )

      mockRequest.body = { email: 'test@example.com' }

      await userController.createUser(
        mockRequest as Request,
        mockResponse as Response,
      )

      expect(CreateUserUseCase.prototype.execute).toHaveBeenCalledWith({
        email: 'test@example.com',
      })
      expect(statusMock).toHaveBeenCalledWith(201)
      expect(jsonMock).toHaveBeenCalledWith(mockUserData)
    })

    it('should return 422 if validation error occurs', async () => {
      ;(CreateUserUseCase.prototype.execute as jest.Mock).mockRejectedValue(
        new Error('ValidationError: invalid email'),
      )

      mockRequest.body = { email: 'invalid-email' }

      await userController.createUser(
        mockRequest as Request,
        mockResponse as Response,
      )

      expect(CreateUserUseCase.prototype.execute).toHaveBeenCalledWith({
        email: 'invalid-email',
      })
      expect(statusMock).toHaveBeenCalledWith(422)
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'ValidationError: invalid email',
      })
    })

    it('should return 500 if an unexpected error occurs', async () => {
      ;(CreateUserUseCase.prototype.execute as jest.Mock).mockRejectedValue(
        new Error('Unexpected error'),
      )

      mockRequest.body = { email: 'test@example.com' }

      await userController.createUser(
        mockRequest as Request,
        mockResponse as Response,
      )

      expect(statusMock).toHaveBeenCalledWith(500)
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Internal Server Error' })
    })
  })

  describe('getAllUsers', () => {
    it('should return all users successfully', async () => {
      const mockUsers = [
        { id: 'user-id-1', email: 'user1@example.com' },
        { id: 'user-id-2', email: 'user2@example.com' },
      ]

      ;(GetUserUseCase.prototype.executeAll as jest.Mock).mockResolvedValue(
        mockUsers,
      )

      await userController.getAllUsers(
        mockRequest as Request,
        mockResponse as Response,
      )

      expect(GetUserUseCase.prototype.executeAll).toHaveBeenCalled()
      expect(jsonMock).toHaveBeenCalledWith(mockUsers)
    })

    it('should return 404 if no users are found', async () => {
      ;(GetUserUseCase.prototype.executeAll as jest.Mock).mockRejectedValue(
        new Error('No users found'),
      )

      await userController.getAllUsers(
        mockRequest as Request,
        mockResponse as Response,
      )

      expect(statusMock).toHaveBeenCalledWith(404)
      expect(jsonMock).toHaveBeenCalledWith({ error: 'No users found' })
    })
  })

  describe('getUserById', () => {
    it('should return a user by ID successfully', async () => {
      const mockUser = { id: 'user-id-123', email: 'test@example.com' }

      ;(GetUserUseCase.prototype.execute as jest.Mock).mockResolvedValue(
        mockUser,
      )

      mockRequest.params = { id: 'user-id-123' }

      await userController.getUserById(
        mockRequest as Request,
        mockResponse as Response,
      )

      expect(GetUserUseCase.prototype.execute).toHaveBeenCalledWith({
        id: 'user-id-123',
      })
      expect(jsonMock).toHaveBeenCalledWith(mockUser)
    })

    it('should return 404 if user is not found', async () => {
      ;(GetUserUseCase.prototype.execute as jest.Mock).mockRejectedValue(
        new Error('User not found'),
      )

      mockRequest.params = { id: 'user-id-123' }

      await userController.getUserById(
        mockRequest as Request,
        mockResponse as Response,
      )

      expect(statusMock).toHaveBeenCalledWith(404)
      expect(jsonMock).toHaveBeenCalledWith({ error: 'User not found' })
    })
  })

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      ;(DeleteUserUseCase.prototype.execute as jest.Mock).mockResolvedValue(
        null,
      )

      mockRequest.params = { id: 'user-id-123' }

      await userController.deleteUser(
        mockRequest as Request,
        mockResponse as Response,
      )

      expect(DeleteUserUseCase.prototype.execute).toHaveBeenCalledWith({
        id: 'user-id-123',
      })
      expect(statusMock).toHaveBeenCalledWith(204)
      expect(jsonMock).toHaveBeenCalledWith(null)
    })

    it('should return 404 if user to delete is not found', async () => {
      ;(DeleteUserUseCase.prototype.execute as jest.Mock).mockRejectedValue(
        new Error('User not found'),
      )

      mockRequest.params = { id: 'user-id-123' }

      await userController.deleteUser(
        mockRequest as Request,
        mockResponse as Response,
      )

      expect(statusMock).toHaveBeenCalledWith(404)
      expect(jsonMock).toHaveBeenCalledWith({ error: 'User not found' })
    })
  })
})
