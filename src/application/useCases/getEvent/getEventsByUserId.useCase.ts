import { EventRepository } from '@domain/repositories/repositoryInterfaces'
import logger from '@utils/logger'
import { GetEventsByUserIdRequestModel } from './getEventsByUserId.requestModel'
import { GetEventsByUserIdResponseModel } from './getEventsByUserId.responseModel'

export class GetEventsByUserIdUseCase {
  constructor(private eventRepository: EventRepository) {}

  async execute(
    request: GetEventsByUserIdRequestModel,
  ): Promise<GetEventsByUserIdResponseModel[]> {
    logger.info(`Getting events for user ${request.userId}`)

    const { userId } = request

    if (!userId) {
      logger.error('User ID is required')
      throw new Error('User ID is required')
    }

    const events = await this.eventRepository.findAllByUserId(userId)

    logger.debug(`getEventsByUserId.useCase > events`, events)

    return events.map((event) => ({
      id: event.id,
      userId: event.userId,
      consents: event.consents,
      createdAt: event.createdAt,
    }))
  }
}