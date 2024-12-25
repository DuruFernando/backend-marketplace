import { Category } from 'src/domain/forum/enterprise/entities/category'
import { CategoryRepository } from '../../../../../src/domain/forum/application/repositories/category-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaCategoryMapper } from '../mappers/prisma-category-mapper'

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private prisma: PrismaService) {}

  async findByTitle(title: string): Promise<Category | null> {
    const category = await this.prisma.category.findFirst({
      where: {
        title,
      },
    })

    if (!category) {
      return null
    }

    return PrismaCategoryMapper.toDomain(category)
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return categories.map(PrismaCategoryMapper.toDomain)
  }

  async create(category: Category): Promise<void> {
    const data = PrismaCategoryMapper.toPersistence(category)

    await this.prisma.category.create({
      data,
    })
  }

  async save(category: Category): Promise<void> {
    const data = PrismaCategoryMapper.toPersistence(category)

    await this.prisma.category.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
