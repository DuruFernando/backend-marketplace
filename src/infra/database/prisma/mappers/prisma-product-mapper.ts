import { Prisma, Product as PrismaProduct } from '@prisma/client'
import { Product } from '../../../../../src/domain/forum/enterprise/entities/product'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'

export class PrismaProductMapper {
  static toDomain(raw: PrismaProduct): Product {
    return Product.create(
      {
        title: raw.title,
        description: raw.description,
        priceInCents: raw.priceInCents,
        status: raw.status,
        soldAt: raw.soldAt,
        availableAt: raw.availableAt,
        ownerId: new UniqueEntityID(raw.ownerId),
        categoryId: new UniqueEntityID(raw.categoryId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistence(product: Product): Prisma.ProductUncheckedCreateInput {
    return {
      id: product.id.toString(),
      title: product.title,
      description: product.description,
      priceInCents: product.priceInCents,
      status: product.status,
      soldAt: product.soldAt,
      ownerId: product.ownerId.toString(),
      categoryId: product.categoryId.toString(),
      availableAt: product.availableAt,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }
  }
}
