import { UserController } from '@controllers/userController'
import { EventRepositoryPrisma } from '@infraestructure/orm/eventRepositoryPrisma'
import { UserRepositoryPrisma } from '@infraestructure/orm/userRepositoryPrisma'
import { PrismaClient } from '@prisma/client'
import { Router } from 'express'

const router = Router()
const prisma = new PrismaClient()
const userRepository = new UserRepositoryPrisma(prisma)
const eventRepository = new EventRepositoryPrisma(prisma)
const userController = new UserController(userRepository, eventRepository)

router.post('/', (req, res) => userController.createUser(req, res))
router.get('/', (req, res) => userController.getAllUsers(req, res))
router.get('/:id', (req, res) => userController.getUserById(req, res))
router.delete('/:id', (req, res) => userController.deleteUser(req, res))

export default router
