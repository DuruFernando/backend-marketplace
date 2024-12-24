import { User as PrismaSeller } from '@prisma/client'
import { Seller } from '../../../../../src/domain/forum/enterprise/entities/seller'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'

export class PrismaSellerMapper {
  static toDomain(raw: PrismaSeller): Seller {
    return Seller.create(
      {
        name: raw.name,
        email: raw.email,
        phone: raw.phone,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    )
  }
}
