import { faker } from '@faker-js/faker'
import {
  Seller,
  SellerProps,
} from '../../src/domain/forum/enterprise/entities/seller'
import { UniqueEntityID } from '../../src/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../src/infra/database/prisma/prisma.service'
import { PrismaSellerMapper } from '../../src/infra/database/prisma/mappers/prisma-seller-mapper'

export function makeSeller(
  override: Partial<SellerProps> = {},
  id?: UniqueEntityID,
) {
  const seller = Seller.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      phone: faker.phone.number(),
      ...override,
    },
    id,
  )

  return seller
}

@Injectable()
export class SellerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaSeller(data: Partial<SellerProps> = {}): Promise<Seller> {
    const seller = makeSeller(data)

    await this.prisma.user.create({
      data: PrismaSellerMapper.toPersistence(seller),
    })

    return seller
  }
}
