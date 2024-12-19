import request from 'supertest'
import app from '../../../app'

describe('UserController', () => {
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({ email: 'test@example.com' })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('email', 'test@example.com')
  })

  it('should return 400 for an invalid email', async () => {
    const response = await request(app)
      .post('/users')
      .send({ email: 'invalid' })

    expect(response.status).toBe(400)
  })
})
