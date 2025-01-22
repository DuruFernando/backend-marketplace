import { Product } from 'src/domain/forum/enterprise/entities/product'
import { ProductRepository } from '../../../../../src/domain/forum/application/repositories/product-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaProductMapper } from '../mappers/prisma-product-mapper'
import { ProductAttachmentsRepository } from '../../../../domain/forum/application/repositories/product-attachments-repository'
import { ProductDetails } from '../../../../domain/forum/enterprise/entities/value-objects/product-details'
import { PrismaProductDetailsMapper } from '../mappers/prisma-product-details-mapper'
import { ProductParams } from '../../../../core/repositories/product-params'

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(
    private prisma: PrismaService,
    private productAttachmentRepository: ProductAttachmentsRepository,
  ) {}

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findFirst({
      where: {
        id,
      },
    })

    if (!product) {
      return null
    }

    return PrismaProductMapper.toDomain(product)
  }

  async findDetailById(id: string): Promise<ProductDetails | null> {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        owner: true,
        category: true,
        attachments: true,
      },
    })

    if (!product) {
      return null
    }

    const productDetails = PrismaProductDetailsMapper.toDomain(product)

    return productDetails
  }

  async findAll({ q, status, page }: ProductParams): Promise<ProductDetails[]> {
    const perPage = 20
    const products = await this.prisma.product.findMany({
      where: {
        status,
        OR: [
          {
            title: {
              contains: q,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: q,
              mode: 'insensitive',
            },
          },
        ],
      },
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        owner: true,
        category: true,
        attachments: true,
      },
    })

    return products.map(PrismaProductDetailsMapper.toDomain)
  }

  async create(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPersistence(product)

    await this.prisma.product.create({
      data,
    })

    await this.productAttachmentRepository.createMany(
      product.attachments.getItems(),
    )
  }

  async save(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPersistence(product)

    await Promise.all([
      this.prisma.product.update({
        where: {
          id: data.id,
        },
        data,
      }),
      this.productAttachmentRepository.createMany(
        product.attachments.getNewItems(),
      ),
      this.productAttachmentRepository.deleteMany(
        product.attachments.getRemovedItems(),
      ),
    ])
  }
}
