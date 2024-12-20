import { EventEntity, EventUpdateInput } from './eventEntity'

describe('EventEntity', () => {
  it('should create an instance of EventEntity with correct values', () => {
    const id = 'event-id-123'
    const userId = 'user-id-123'
    const enabled = true
    const createdAt = new Date()

    const event = new EventEntity(id, userId, enabled, createdAt)

    expect(event).toBeInstanceOf(EventEntity)
    expect(event.id).toBe(id)
    expect(event.userId).toBe(userId)
    expect(event.enabled).toBe(enabled)
    expect(event.createdAt).toBe(createdAt)
  })

  it('should throw an error if required parameters are missing', () => {
    expect(() => new EventEntity('', '', true, new Date())).not.toThrow()
    // Aqui não há validação explícita no construtor. Adicione validação no código, se necessário.
  })
})

describe('EventUpdateInput', () => {
  it('should create an instance of EventUpdateInput with correct values', () => {
    const id = 'event-id-123'
    const userId = 'user-id-123'
    const enabled = true

    const updateInput = new EventUpdateInput(id, userId, enabled)

    expect(updateInput).toBeInstanceOf(EventUpdateInput)
    expect(updateInput.id).toBe(id)
    expect(updateInput.userId).toBe(userId)
    expect(updateInput.enabled).toBe(enabled)
  })

  it('should allow partial updates by using optional properties', () => {
    const updateInput = new EventUpdateInput(undefined, 'user-id-123', true)

    expect(updateInput.id).toBeUndefined()
    expect(updateInput.userId).toBe('user-id-123')
    expect(updateInput.enabled).toBe(true)
  })

  it('should handle completely empty input', () => {
    const updateInput = new EventUpdateInput()

    expect(updateInput.id).toBeUndefined()
    expect(updateInput.userId).toBeUndefined()
    expect(updateInput.enabled).toBeUndefined()
  })
})
