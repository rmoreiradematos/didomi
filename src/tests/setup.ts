import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

beforeEach(async () => {
  await prisma.event.deleteMany()
  await prisma.user.deleteMany()
})

afterAll(async () => {
  await prisma.$disconnect()
})
