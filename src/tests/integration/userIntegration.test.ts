import { PrismaClient } from '@prisma/client'
import request from 'supertest'
import app from '../../app'

const prisma = new PrismaClient()

describe('User Integration Tests', () => {
  afterAll(async () => {
    await prisma.user.deleteMany()
    await prisma.$disconnect()
  })

  it('should create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({ email: 'testuser@example.com' })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.email).toBe('testuser@example.com')
    expect(response.body.consents).toEqual([])
  })

  it('should get all users', async () => {
    const response = await request(app).get('/users')

    expect(response.status).toBe(200)
    expect(response.body.length).toBeGreaterThan(0)
    expect(response.body[0]).toHaveProperty('id')
    expect(response.body[0]).toHaveProperty('email')
  })

  it('should get a user by ID', async () => {
    const user = await prisma.user.create({
      data: { email: 'userbyid@example.com' },
    })

    const response = await request(app).get(`/users/${user.id}`)

    expect(response.status).toBe(200)
    expect(response.body.id).toBe(user.id)
    expect(response.body.email).toBe(user.email)
  })

  it('should delete a user', async () => {
    const user = await prisma.user.create({
      data: { email: 'deleteuser@example.com' },
    })

    const response = await request(app).delete(`/users/${user.id}`)

    expect(response.status).toBe(204)

    const userCheck = await prisma.user.findUnique({ where: { id: user.id } })
    expect(userCheck).toBeNull()
  })

  it('should return 404 when trying to delete a non-existent user', async () => {
    const response = await request(app).delete(`/users/non-existent-id`)

    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty('error', 'User not found')
  })
})
