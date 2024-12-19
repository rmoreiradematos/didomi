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
import eventRoutes from './interfaces/http/routes/eventRoutes'
import userRoutes from './interfaces/http/routes/userRoutes'

const provider = new NodeTracerProvider()
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()))
provider.register()

const app = express()

app.use(express.json())
app.use(metricsMiddleware)
app.use('/users', userRoutes)
app.use('/events', eventRoutes)
app.get('/metrics', metricsEndpoint)

export default app
