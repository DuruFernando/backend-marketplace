import { SellersRepository } from '../../src/domain/forum/application/repositories/seller-repository'
import { DomainEvents } from '../../src/core/events/domain-events'
import { Seller } from '../../src/domain/forum/enterprise/entities/seller'

export class InMemorySellerRepository implements SellersRepository {
  public items: Seller[] = []

  async findByEmail(email: string) {
    const seller = this.items.find((item) => item.email === email)

    if (!seller) {
      return null
    }

    return seller
  }

  async create(seller: Seller) {
    this.items.push(seller)

    DomainEvents.dispatchEventsForAggregate(seller.id)
  }
}
