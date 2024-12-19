import { PrismaClient } from '@prisma/client'
import request from 'supertest'
import app from '../../app'

const prisma = new PrismaClient()

describe('Event Integration Tests', () => {
  let userId: string

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: { email: 'testuser@example.com' },
    })
    userId = user.id
  })

  afterAll(async () => {
    await prisma.event.deleteMany()
    await prisma.user.deleteMany()
    await prisma.$disconnect()
  })

  it('should create a new event for a user', async () => {
    const response = await request(app)
      .post('/events')
      .send({
        userId,
        consents: [{ id: 'email_notifications', enabled: true }],
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.userId).toBe(userId)
    expect(response.body.consents).toEqual([
      { id: 'email_notifications', enabled: true },
    ])
  })

  it('should get all events for a user', async () => {
    await prisma.event.create({
      data: {
        userId,
        consents: [{ id: 'sms_notifications', enabled: false }],
      },
    })

    const response = await request(app).get(`/events/${userId}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(2)
    expect(response.body[0]).toHaveProperty('id')
    expect(response.body[0].userId).toBe(userId)
  })

  it('should return an empty array if the user has no events', async () => {
    const newUser = await prisma.user.create({
      data: { email: 'nouser@example.com' },
    })

    const response = await request(app).get(`/events/${newUser.id}`)

    expect(response.status).toBe(200)
    expect(response.body).toEqual([])
  })
})
