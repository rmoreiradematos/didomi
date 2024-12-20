import { PrismaClient } from '@prisma/client'
import { UserRepositoryPrisma } from './userRepositoryPrisma'

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
  })),
}))

describe('UserRepositoryPrisma', () => {
  let prisma: PrismaClient
  let userRepository: UserRepositoryPrisma

  beforeEach(() => {
    prisma = new PrismaClient()
    userRepository = new UserRepositoryPrisma(prisma)
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create a new user and return a UserEntity', async () => {
      const email = 'test@example.com'

      const mockPrismaUser = { id: 'user-id-123', email, consents: [] }
      ;(prisma.user.create as jest.Mock).mockResolvedValue(mockPrismaUser)

      const result = await userRepository.create(email)

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { email },
      })
      expect(result).toEqual({
        id: 'user-id-123',
        email,
        consents: [],
      })
    })
  })

  describe('findById', () => {
    it('should return a user with consents when found', async () => {
      const userId = 'user-id-123'

      const mockPrismaUser = {
        id: userId,
        email: 'test@example.com',
        consents: [{ id: 'consent-id', enabled: true }],
      }
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockPrismaUser)

      const result = await userRepository.findById(userId)

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        include: { consents: true },
      })
      expect(result).toEqual(mockPrismaUser)
    })

    it('should return null if the user is not found', async () => {
      const userId = 'user-id-123'
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

      const result = await userRepository.findById(userId)

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        include: { consents: true },
      })
      expect(result).toBeNull()
    })
  })

  describe('findAll', () => {
    it('should return all users with their consents', async () => {
      const mockPrismaUsers = [
        { id: 'user-id-1', email: 'user1@example.com', consents: [] },
        { id: 'user-id-2', email: 'user2@example.com', consents: [] },
      ]
      ;(prisma.user.findMany as jest.Mock).mockResolvedValue(mockPrismaUsers)

      const result = await userRepository.findAll()

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        include: { consents: true },
      })
      expect(result).toEqual(mockPrismaUsers)
    })
  })

  describe('delete', () => {
    it('should delete a user by ID', async () => {
      const userId = 'user-id-123'

      ;(prisma.user.delete as jest.Mock).mockResolvedValue({ id: userId })

      await userRepository.delete(userId)

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: userId },
      })
    })
  })

  describe('mapToUserEntity', () => {
    it('should map a Prisma user to a UserEntity', () => {
      const prismaUser = {
        id: 'user-id-123',
        email: 'test@example.com',
        consents: [{ id: 'consent-id', enabled: true }],
      }

      const result = userRepository['mapToUserEntity'](prismaUser)

      expect(result).toEqual({
        id: 'user-id-123',
        email: 'test@example.com',
        consents: [{ id: 'consent-id', enabled: true }],
      })
    })

    it('should handle null or undefined consents', () => {
      const prismaUser = {
        id: 'user-id-123',
        email: 'test@example.com',
        consents: null,
      }

      const result = userRepository['mapToUserEntity'](prismaUser)

      expect(result).toEqual({
        id: 'user-id-123',
        email: 'test@example.com',
        consents: [],
      })
    })
  })
})
