import { CategoryRepository } from '../../src/domain/forum/application/repositories/category-repository'
import { DomainEvents } from '../../src/core/events/domain-events'
import { Category } from '../../src/domain/forum/enterprise/entities/category'

export class InMemoryCategoryRepository implements CategoryRepository {
  public items: Category[] = []

  async findByTitle(title: string) {
    const category = this.items.find((item) => item.title === title)

    if (!category) {
      return null
    }

    return category
  }

  async findAll() {
    const categories = this.items.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    )

    return categories
  }

  async create(category: Category) {
    this.items.push(category)

    DomainEvents.dispatchEventsForAggregate(category.id)
  }

  async save(category: Category) {
    const itemIndex = this.items.findIndex((item) => item.id === category.id)

    this.items[itemIndex] = category

    DomainEvents.dispatchEventsForAggregate(category.id)
  }
}
