import { EventRepository } from '@repositories/eventRepository'
import { UserRepository } from '@repositories/userRepository'
import logger from '@utils/logger'
import { mappingConsents } from '@utils/mappingUserConsents'
import { GetUserRequestModel } from './getUser.requestModel'
import { GetUserResponseModel } from './getUser.responseModel'

export class GetUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private eventRepository: EventRepository,
  ) {}

  async execute(request: GetUserRequestModel): Promise<GetUserResponseModel> {
    logger.info(`Getting user with id ${request.id}`)
    const { id } = request

    if (id.length === 0) {
      logger.error('User ID is required')
      throw new Error('User ID is required')
    }

    const user = await this.userRepository.findById(id)

    logger.debug(`getUser.useCase > user`, user)

    if (!user) {
      logger.error('User not found')
      throw new Error('User not found')
    }

    const consents = mappingConsents(user.consents)

    return {
      id: user.id,
      email: user.email,
      consents,
    }
  }

  async executeAll(): Promise<GetUserResponseModel[]> {
    logger.info(`Getting all users`)
    const users = await this.userRepository.findAll()

    logger.debug(`getUser.useCase > users`, users)

    const userPromises = users.map(async (user) => {
      const consents = await this.eventRepository.findAllByUserId(user.id)
      user.consents = mappingConsents(consents)
      return user
    })

    const treatedUser = await Promise.all(userPromises)

    return treatedUser.map((user) => ({
      id: user.id,
      email: user.email,
      consents: user.consents ?? [],
    }))
  }
}
