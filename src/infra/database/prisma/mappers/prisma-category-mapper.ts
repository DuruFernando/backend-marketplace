import { Prisma, Category as PrismaCategory } from '@prisma/client'
import { Category } from '../../../../../src/domain/forum/enterprise/entities/category'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { Slug } from 'src/domain/forum/enterprise/entities/value-objects/slug'

export class PrismaCategoryMapper {
  static toDomain(raw: PrismaCategory): Category {
    return Category.create(
      {
        title: raw.title,
        slug: Slug.create(raw.slug),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistence(
    category: Category,
  ): Prisma.CategoryUncheckedCreateInput {
    return {
      id: category.id.toString(),
      title: category.title,
      slug: category.slug.value,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }
  }
}
