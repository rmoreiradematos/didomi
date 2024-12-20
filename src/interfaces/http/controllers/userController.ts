import { CreateUserUseCase } from '@application/useCases/createUser/createUser.useCase'
import { DeleteUserUseCase } from '@application/useCases/deleteUser/deleteUser.useCase'
import { GetUserUseCase } from '@application/useCases/getUser/getUser.useCase'
import { EventRepository } from '@repositories/eventRepository'
import { UserRepository } from '@repositories/userRepository'
import { Request, Response } from 'express'

export class UserController {
  private createUserUseCase: CreateUserUseCase
  private getUserUseCase: GetUserUseCase
  private deleteUserUseCase: DeleteUserUseCase

  constructor(
    userRepository: UserRepository,
    eventRepository: EventRepository,
  ) {
    this.createUserUseCase = new CreateUserUseCase(userRepository)
    this.getUserUseCase = new GetUserUseCase(userRepository, eventRepository)
    this.deleteUserUseCase = new DeleteUserUseCase(userRepository)
  }

  async createUser(req: Request, res: Response) {
    try {
      const result = await this.createUserUseCase.execute(req.body)
      res.status(201).json(result)
    } catch (err: any) {
      if (
        err.name === 'ValidationError' ||
        err.message.includes('invalid') ||
        err.message.includes('exists')
      ) {
        res.status(422).json({ error: err.message })
      }
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const result = await this.getUserUseCase.executeAll()
      res.json(result)
    } catch (err: any) {
      res.status(404).json({ error: err.message })
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const result = await this.getUserUseCase.execute({ id: req.params.id })
      res.json(result)
    } catch (err: any) {
      res.status(404).json({ error: err.message })
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const result = await this.deleteUserUseCase.execute({ id: req.params.id })
      res.status(204).json(result)
    } catch (err: any) {
      res.status(404).json({ error: err.message })
    }
  }
}
