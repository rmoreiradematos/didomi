import { UserEntity } from './userEntity'

describe('UserEntity', () => {
  describe('constructor', () => {
    it('should create an instance of UserEntity with default consents', () => {
      const id = 'user-id-123'
      const email = 'test@example.com'

      const user = new UserEntity(id, email)

      expect(user).toBeInstanceOf(UserEntity)
      expect(user.id).toBe(id)
      expect(user.email).toBe(email)
      expect(user.consents).toEqual([])
    })

    it('should create an instance of UserEntity with provided consents', () => {
      const id = 'user-id-123'
      const email = 'test@example.com'
      const consents = [{ id: 'email_notifications', enabled: true }]

      const user = new UserEntity(id, email, consents)

      expect(user.consents).toEqual(consents)
    })
  })

  describe('create', () => {
    it('should create a new UserEntity instance using the static method', () => {
      const id = 'user-id-123'
      const email = 'test@example.com'
      const consents = [{ id: 'email_notifications', enabled: true }]

      const user = UserEntity.create(id, email, consents)

      expect(user).toBeInstanceOf(UserEntity)
      expect(user.id).toBe(id)
      expect(user.email).toBe(email)
      expect(user.consents).toEqual(consents)
    })

    it('should throw an error if the email is invalid', () => {
      const id = 'user-id-123'
      const invalidEmail = 'invalid-email'

      expect(() => UserEntity.create(id, invalidEmail)).toThrow(
        'Invalid email address',
      )
    })

    it('should handle optional consents in the static method', () => {
      const id = 'user-id-123'
      const email = 'test@example.com'

      const user = UserEntity.create(id, email)

      expect(user.consents).toEqual([])
    })
  })
})
