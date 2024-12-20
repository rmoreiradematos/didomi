import { NodeTracerProvider } from '@opentelemetry/node'
import {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/tracing'
import express from 'express'
import {
  metricsEndpoint,
  metricsMiddleware,
} from './interfaces/http/middlewares/collectMetrics'
import { loggingMiddleware } from './interfaces/http/middlewares/logginRequestMiddleware'
import eventRoutes from './interfaces/http/routes/eventRoutes'
import userRoutes from './interfaces/http/routes/userRoutes'

const provider = new NodeTracerProvider()
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()))
provider.register()

const app = express()

app.use(express.json())
app.use(metricsMiddleware)
app.use(loggingMiddleware)
app.use('/users', userRoutes)
app.use('/events', eventRoutes)
app.get('/metrics', metricsEndpoint)
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'UP' })
})

export default app
