import { UserEntity } from '@domain/entities/userEntity'
import { UserRepository } from '@domain/repositories/repositoryInterfaces'
import logger from '@utils/logger'
import { CreateUserRequestModel } from './createUser.requestModel'
import { CreateUserResponseModel } from './createUser.responseModel'

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(
    request: CreateUserRequestModel,
  ): Promise<CreateUserResponseModel> {
    logger.info(`Creating user with email ${request.email}`)
    const { email } = request

    const userEntity = UserEntity.create('', email)

    const user = await this.userRepository.create(userEntity.email)

    logger.debug(`createUser.useCase > user`, user)

    return {
      id: user.id,
      email: user.email,
      consents: user.consents,
    }
  }
}
