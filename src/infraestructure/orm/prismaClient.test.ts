import prismaClient from './prismaClient'

describe('PrismaClient', () => {
  afterAll(async () => {
    await prismaClient.$disconnect()
  })

  it('should connect to the database successfully', async () => {
    await expect(prismaClient.$connect()).resolves.not.toThrow()
  })
})
