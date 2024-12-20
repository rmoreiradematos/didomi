import { UserEntity } from '@domain/entities/userEntity'
import { ValidationError } from '@domain/exceptions/validationError'
import { UserRepository } from '@repositories/userRepository'
import logger from '@utils/logger'
import { CreateUserRequestModel } from './createUser.requestModel'
import { CreateUserResponseModel } from './createUser.responseModel'

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(
    request: CreateUserRequestModel,
  ): Promise<CreateUserResponseModel> {
    try {
      if (!request.email || typeof request.email !== 'string') {
        throw new ValidationError(
          'Invalid payload: "email" is required and must be a string',
        )
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(request.email)) {
        throw new ValidationError('Invalid email format')
      }

      logger.info(`Creating user with email ${request.email}`)
      const { email } = request

      const userEntity = UserEntity.create('', email, [])

      const user = await this.userRepository.create(userEntity.email)

      logger.debug(`createUser.useCase > user`, user)

      return {
        id: user.id,
        email: user.email,
        consents: user.consents,
      }
    } catch (err) {
      logger.error(`createUser.useCase > error`, err)
      throw err
    }
  }
}
