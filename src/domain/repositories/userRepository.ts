export interface UserRepository {
  create(email: string): Promise<any>
  findById(id: string): Promise<any | null>
  findAll(): Promise<any[]>
  delete(id: string): Promise<void>
}

export interface EventRepository {
  create(userId: string, consents: any): Promise<any>
  findAllByUserId(userId: string): Promise<any[]>
}
