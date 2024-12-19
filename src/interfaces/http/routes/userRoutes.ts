import { PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { UserRepositoryPrisma } from '../../../infraestructure/orm/userRepositoryPrisma'
import { UserController } from '../controllers/userController'

const router = Router()
const prisma = new PrismaClient()
const userRepository = new UserRepositoryPrisma(prisma)
const userController = new UserController(userRepository)

router.post('/', (req, res) => userController.createUser(req, res))
router.get('/:id', (req, res) => userController.getUser(req, res))
router.delete('/:id', (req, res) => userController.deleteUser(req, res))

export default router
