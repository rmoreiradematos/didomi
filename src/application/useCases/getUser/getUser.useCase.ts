import { UserRepository } from '@domain/repositories/repositoryInterfaces'
import logger from '@utils/logger'
import { GetUserRequestModel } from './getUser.requestModel'
import { GetUserResponseModel } from './getUser.responseModel'

export class GetUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(request: GetUserRequestModel): Promise<GetUserResponseModel> {
    logger.info(`Getting user with id ${request.id}`)
    const { id } = request

    const user = await this.userRepository.findById(id)

    logger.debug(`getUser.useCase > user`, user)
    if (!user) {
      logger.error('User not found')
      throw new Error('User not found')
    }

    return {
      id: user.id,
      email: user.email,
      consents: user.consents,
    }
  }
}
