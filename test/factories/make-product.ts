import { faker } from '@faker-js/faker'
import {
  Product,
  ProductProps,
} from '../../src/domain/forum/enterprise/entities/product'
import { UniqueEntityID } from '../../src/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../src/infra/database/prisma/prisma.service'
import { PrismaProductMapper } from '../../src/infra/database/prisma/mappers/prisma-product-mapper'

export function makeProduct(
  override: Partial<ProductProps> = {},
  id?: UniqueEntityID,
) {
  const product = Product.create(
    {
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      priceInCents: faker.number.int({ min: 111111, max: 999999 }),
      ownerId: new UniqueEntityID(),
      categoryId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return product
}

@Injectable()
export class ProductFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaProduct(data: Partial<ProductProps> = {}): Promise<Product> {
    const product = makeProduct(data)

    await this.prisma.product.create({
      data: PrismaProductMapper.toPersistence(product),
    })

    return product
  }
}
