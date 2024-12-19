import { PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { EventController } from '../controllers/eventController'

const prisma = new PrismaClient()
const eventController = new EventController(prisma)
const router = Router()

router.post('/', (req, res) => eventController.createEvent(req, res))
router.get('/:userId', (req, res) => eventController.getUserEvents(req, res))

export default router
