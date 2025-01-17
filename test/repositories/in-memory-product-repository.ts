import { ProductRepository } from '../../src/domain/forum/application/repositories/product-repository'
import { DomainEvents } from '../../src/core/events/domain-events'
import { Product } from '../../src/domain/forum/enterprise/entities/product'
import { UniqueEntityID } from '../../src/core/entities/unique-entity-id'
import { ProductAttachmentsRepository } from '../../src/domain/forum/application/repositories/product-attachments-repository'

export class InMemoryProductRepository implements ProductRepository {
  public items: Product[] = []

  constructor(
    private productAttachmentsRepository: ProductAttachmentsRepository,
  ) {}

  async findById(id: UniqueEntityID) {
    const product = this.items.find((item) => item.id === id)

    if (!product) {
      return null
    }

    return product
  }

  async findAll() {
    const categories = this.items.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    )

    return categories
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
