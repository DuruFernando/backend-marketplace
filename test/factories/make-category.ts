import { faker } from '@faker-js/faker'
import {
  Category,
  CategoryProps,
} from '../../src/domain/forum/enterprise/entities/category'
import { UniqueEntityID } from '../../src/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../src/infra/database/prisma/prisma.service'
import { PrismaCategoryMapper } from '../../src/infra/database/prisma/mappers/prisma-category-mapper'

export function makeCategory(
  override: Partial<CategoryProps> = {},
  id?: UniqueEntityID,
) {
  const category = Category.create(
    {
      title: faker.commerce.productMaterial(),
      ...override,
    },
    id,
  )

  return category
}

@Injectable()
export class CategoryFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCategory(
    data: Partial<CategoryProps> = {},
  ): Promise<Category> {
    const category = makeCategory(data)

    await this.prisma.category.create({
      data: PrismaCategoryMapper.toPersistence(category),
    })

    return category
  }
}
