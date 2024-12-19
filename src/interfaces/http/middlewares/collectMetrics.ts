import { Request, Response } from 'express'
import client from 'prom-client'

const register = new client.Registry()

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total of HTTP requests',
  labelNames: ['method', 'route', 'status'],
})

register.registerMetric(httpRequestCounter)

export const metricsMiddleware = (
  req: Request,
  res: Response,
  next: Function,
) => {
  res.on('finish', () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode,
    })
  })
  next()
}

export const metricsEndpoint = async (req: Request, res: Response) => {
  res.set('Content-Type', register.contentType)
  res.end(await register.metrics())
}
