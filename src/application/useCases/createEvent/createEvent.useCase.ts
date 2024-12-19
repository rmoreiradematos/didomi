import { ValidationError } from '@domain/exceptions/validationError'
import { EventRepository } from '@domain/repositories/repositoryInterfaces'
import logger from '@utils/logger'
import { CreateEventRequestModel } from './createEvent.requestModel'
import { CreateEventResponseModel } from './createEvent.responseModel'

export class CreateEventUseCase {
  constructor(private eventRepository: EventRepository) {}

  async execute(
    request: CreateEventRequestModel,
  ): Promise<CreateEventResponseModel> {
    const { userId, consents } = request

    logger.info(`Creating event for user ${userId}`)

    if (!userId) {
      logger.error('User ID is required')
      throw new ValidationError('User ID is required')
    }

    if (!Array.isArray(consents) || consents.length === 0) {
      logger.error('Consents must be a non-empty array')
      throw new ValidationError('Consents must be a non-empty array')
    }

    const event = await this.eventRepository.create(userId, consents)

    logger.debug(`createEvent.useCase > event`, event)

    return {
      id: event.id,
      userId: event.userId,
      consents: event.consents,
      createdAt: event.createdAt,
    }
  }
}
