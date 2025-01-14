import { Seller } from '../../enterprise/entities/seller'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'

export abstract class SellerRepository {
  abstract findMe(id: UniqueEntityID): Promise<Seller | null>
  abstract findByEmail(email: string): Promise<Seller | null>
  abstract findByPhone(phone: string): Promise<Seller | null>
  abstract create(seller: Seller): Promise<void>
  abstract save(seller: Seller): Promise<void>
}
