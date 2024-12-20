import { UserRepository } from '@repositories/userRepository'
import logger from '@utils/logger'
import { DeleteUserRequestModel } from './deleteUser.requestModel'
import { DeleteUserResponseModel } from './deleteUser.responseModel'

export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(
    request: DeleteUserRequestModel,
  ): Promise<DeleteUserResponseModel> {
    logger.info(`Deleting user with id ${request.id}`)

    const { id } = request

    const user = await this.userRepository.findById(id)

    logger.debug(`deleteUser.useCase > user`, user)
    if (!user) {
      logger.error('User not found')
      throw new Error('User not found')
    }

    await this.userRepository.delete(id)

    logger.info(`User with id ${id} deleted`)

    return { success: true }
  }
}
