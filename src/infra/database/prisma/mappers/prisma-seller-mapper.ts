import { Prisma, User as PrismaSeller } from '@prisma/client'
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
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toDomainMe(raw: PrismaSeller): Seller {
    return Seller.create(
      {
        id: new UniqueEntityID(raw.id),
        name: raw.name,
        email: raw.email,
        phone: raw.phone,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistence(seller: Seller): Prisma.UserUncheckedCreateInput {
    return {
      name: seller.name,
      email: seller.email,
      phone: seller.phone,
      password: seller.password as string,
      createdAt: seller.createdAt,
      updatedAt: seller.updatedAt,
    }
  }
}
