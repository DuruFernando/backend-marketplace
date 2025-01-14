import { SellerRepository } from '../../src/domain/forum/application/repositories/seller-repository'
import { DomainEvents } from '../../src/core/events/domain-events'
import { Seller } from '../../src/domain/forum/enterprise/entities/seller'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'

export class InMemorySellerRepository implements SellerRepository {
  public items: Seller[] = []

  async findMe(id: UniqueEntityID) {
    const seller = this.items.find((item) => item.id === id)

    if (!seller) {
      return null
    }

    return seller
  }

  async findByPhone(phone: string) {
    const seller = this.items.find((item) => item.phone === phone)

    if (!seller) {
      return null
    }

    return seller
  }

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

  async save(seller: Seller) {
    const itemIndex = this.items.findIndex((item) => item.id === seller.id)

    this.items[itemIndex] = seller

    DomainEvents.dispatchEventsForAggregate(seller.id)
  }
}
