import request from 'supertest'
import app from './app'

describe('Server', () => {
  it('should start and respond to health check endpoint', async () => {
    const res = await request(app).get('/health')

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'UP' })
  })

  it('should return 404 for undefined routes', async () => {
    const res = await request(app).get('/undefined-route')

    expect(res.status).toBe(404)
  })
})
