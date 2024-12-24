import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'
import { DomainEvent } from '../../../../core/events/domain-event'
import { Seller } from '../entities/seller'

export class SellerBestAnswerChosenEvent implements DomainEvent {
  public ocurredAt: Date
  public seller: Seller

  constructor(seller: Seller) {
    this.seller = seller
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.seller.id
  }
}
