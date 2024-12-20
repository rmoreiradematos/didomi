import { ValidationError } from '@domain/exceptions/validationError'
import { EventRepository } from '@repositories/eventRepository'
import { UserRepository } from '@repositories/userRepository'
import logger from '@utils/logger'
import { CreateEventRequestModel } from './createEvent.requestModel'
import { CreateEventResponseModel } from './createEvent.responseModel'

export class CreateEventUseCase {
  constructor(
    private eventRepository: EventRepository,
    private userRepository: UserRepository,
  ) {}

  async execute(
    request: CreateEventRequestModel,
  ): Promise<CreateEventResponseModel> {
    const { userId, id } = request
    const enabled = true
    if (id !== 'email_notifications' && id !== 'sms_notifications') {
      logger.error('Invalid event ID')
      throw new ValidationError('Invalid event ID')
    }

    logger.info(`Creating event for user ${userId}`)

    if (!userId) {
      logger.error('User ID is required')
      throw new ValidationError('User ID is required')
    }

    const user = await this.userRepository.findById(userId)

    if (user?.consents && user.consents.length > 0) {
      console.debug('oldEvent', user.consents)
      const lastConsents = user.consents.at(-1)
      await this.eventRepository.edit({ ...lastConsents, enabled: false })
    }

    const event = await this.eventRepository.create(userId, id, enabled)

    logger.debug(`createEvent.useCase > event`, event)

    return {
      id: event.id,
      userId: event.userId,
      enabled: event.enabled,
      createdAt: event.createdAt,
    }
  }
}
