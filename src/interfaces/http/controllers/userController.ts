import { CreateUserUseCase } from '@application/useCases/createUser/createUser.useCase'
import { DeleteUserUseCase } from '@application/useCases/deleteUser/deleteUser.useCase'
import { GetUserUseCase } from '@application/useCases/getUser/getUser.useCase'
import { UserRepository } from '@repositories/repositoryInterfaces'
import { Request, Response } from 'express'

export class UserController {
  private createUserUseCase: CreateUserUseCase
  private getUserUseCase: GetUserUseCase
  private deleteUserUseCase: DeleteUserUseCase

  constructor(userRepository: UserRepository) {
    this.createUserUseCase = new CreateUserUseCase(userRepository)
    this.getUserUseCase = new GetUserUseCase(userRepository)
    this.deleteUserUseCase = new DeleteUserUseCase(userRepository)
  }

  async createUser(req: Request, res: Response) {
    try {
      const result = await this.createUserUseCase.execute(req.body)
      res.status(201).json(result)
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }

  async getUser(req: Request, res: Response) {
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
