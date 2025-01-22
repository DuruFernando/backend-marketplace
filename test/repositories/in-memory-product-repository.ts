import { ProductRepository } from '../../src/domain/forum/application/repositories/product-repository'
import { DomainEvents } from '../../src/core/events/domain-events'
import { Product } from '../../src/domain/forum/enterprise/entities/product'
import { ProductDetails } from '../../src/domain/forum/enterprise/entities/value-objects/product-details'
import { InMemoryProductAttachmentsRepository } from './in-memory-product-attachments-repository'
import { InMemorySellerRepository } from './in-memory-seller-repository'
import { InMemoryCategoryRepository } from './in-memory-category-repository'
import { Category } from '../../src/domain/forum/enterprise/entities/category'
import { UniqueEntityID } from '../../src/core/entities/unique-entity-id'
import { InMemoryAttachmentRepository } from './in-memory-attachments-repository'
import { ProductParams } from '../../src/core/repositories/product-params'

export class InMemoryProductRepository implements ProductRepository {
  public items: Product[] = []

  constructor(
    private productAttachmentsRepository: InMemoryProductAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentRepository,
    private sellerRepository: InMemorySellerRepository,
    private categoryRepository: InMemoryCategoryRepository,
  ) {}

  async findById(id: string) {
    const product = this.items.find((item) => item.id.toString() === id)

    if (!product) {
      return null
    }

    return product
  }

  async findDetailById(id: string) {
    const product = this.items.find((item) => item.id.toString() === id)

    if (!product) {
      return null
    }

    const owner = this.sellerRepository.items.find((seller) =>
      seller.id.equals(product.ownerId),
    )

    if (!owner) {
      throw new Error(
        `Owner with ID "${product.ownerId.toString()}" does not exists`,
      )
    }

    let category:
      | Category
      | { id: UniqueEntityID; title: string; slug: string }
      | undefined = this.categoryRepository.items.find((category) =>
      category.id.equals(product.categoryId),
    )

    if (!category) {
      throw new Error(
        `Category with ID "${product.categoryId.toString()}" does not exists`,
      )
    }

    category = {
      id: category.id,
      title: category.title,
      slug: category.slug.value,
    }

    const productsAttachments = this.productAttachmentsRepository.items.filter(
      (productAttachment) => productAttachment.productId.equals(product.id),
    )

    const attachments = productsAttachments.map((productAttachment) => {
      const attachment = this.attachmentsRepository.items.find((attachment) =>
        attachment.id.equals(productAttachment.attachmentId),
      )

      if (!attachment) {
        throw new Error(
          `Attachment with ID "${productAttachment.attachmentId.toString()}" does not exists`,
        )
      }

      return attachment
    })

    return ProductDetails.create({
      product: {
        id: product.id,
        title: product.title,
        description: product.description,
        priceInCents: product.priceInCents,
        status: product.status,
        owner,
        category,
        attachments,
      },
    })
  }

  async findAll({ q, status, page }: ProductParams): Promise<ProductDetails[]> {
    const products = this.items
      .filter((item) => {
        let ret = true
        ret = [
          item.description.toLowerCase(),
          item.title.toLowerCase(),
        ].includes(q.toLowerCase())

        ret = item.status.toLowerCase() === status.toLowerCase()

        return ret
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)
      .map((product) => {
        const owner = this.sellerRepository.items.find((seller) =>
          seller.id.equals(product.ownerId),
        )
        if (!owner) {
          throw new Error(
            `Owner with ID "${product.ownerId.toString()}" does not exists`,
          )
        }

        let category:
          | Category
          | { id: UniqueEntityID; title: string; slug: string }
          | undefined = this.categoryRepository.items.find((category) =>
          category.id.equals(product.categoryId),
        )

        if (!category) {
          throw new Error(
            `Category with ID "${product.categoryId.toString()}" does not exists`,
          )
        }

        category = {
          id: category.id,
          title: category.title,
          slug: category.slug.value,
        }

        const productsAttachments =
          this.productAttachmentsRepository.items.filter((productAttachment) =>
            productAttachment.productId.equals(product.id),
          )

        const attachments = productsAttachments.map((productAttachment) => {
          const attachment = this.attachmentsRepository.items.find(
            (attachment) =>
              attachment.id.equals(productAttachment.attachmentId),
          )

          if (!attachment) {
            throw new Error(
              `Attachment with ID "${productAttachment.attachmentId.toString()}" does not exists`,
            )
          }

          return attachment
        })

        return ProductDetails.create({
          product: {
            id: product.id,
            title: product.title,
            description: product.description,
            priceInCents: product.priceInCents,
            status: product.status,
            owner,
            category,
            attachments,
          },
        })
      })

    return products
  }

  async create(product: Product) {
    this.items.push(product)

    await this.productAttachmentsRepository.createMany(
      product.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(product.id)
  }

  async save(product: Product) {
    const itemIndex = this.items.findIndex((item) => item.id === product.id)

    this.items[itemIndex] = product

    await this.productAttachmentsRepository.createMany(
      product.attachments.getNewItems(),
    )

    await this.productAttachmentsRepository.deleteMany(
      product.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(product.id)
  }
}
