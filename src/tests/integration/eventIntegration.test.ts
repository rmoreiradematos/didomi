import { PrismaClient } from '@prisma/client'
import request from 'supertest'
import app from '../../app'

const prisma = new PrismaClient()

describe('User Integration Tests', () => {
  let userId: string
  beforeEach(async () => {
    const user = await prisma.user.create({
      data: { email: 'rodrigo@gmail.com' },
    })
    userId = user.id
  })

  it('should create a new event', async () => {
    const response = await request(app)
      .post('/events')
      .send({ userId, id: 'email_notifications' })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.userId).toBe(userId)
    expect(response.body.id).toBe('email_notifications')
    expect(response.body.enabled).toBe(true)
  })

  it('should return an error when receiving an invalid body', async () => {
    const response = await request(app)
      .post('/events')
      .send({ userId: 'userId', id: 'push_notifications' })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('error')
  })
})
