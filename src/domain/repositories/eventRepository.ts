import { EventEntity, EventUpdateInput } from '@domain/entities/eventEntity'

export interface EventRepository {
  create(userId: string, id: string, enabled: boolean): Promise<EventEntity>
  findAllByUserId(userId: string): Promise<EventEntity[]>
  findEventByUserIdAndId(
    userId: string,
    id: string,
  ): Promise<EventEntity | null>
  edit(event: EventUpdateInput): Promise<EventEntity>
}
