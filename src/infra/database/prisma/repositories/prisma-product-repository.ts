import { Product } from 'src/domain/forum/enterprise/entities/product'
import { ProductRepository } from '../../../../../src/domain/forum/application/repositories/product-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaProductMapper } from '../mappers/prisma-product-mapper'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: UniqueEntityID): Promise<Product | null> {
    const product = await this.prisma.product.findFirst({
      where: {
        id: id.toString(),
      },
    })

    if (!product) {
      return null
    }

    return PrismaProductMapper.toDomain(product)
  }

  async findAll(): Promise<Product[]> {
    const categories = await this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return categories.map(PrismaProductMapper.toDomain)
  }

  async create(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPersistence(product)

    await this.prisma.product.create({
      data,
    })
  }

  async save(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPersistence(product)

    await this.prisma.product.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
