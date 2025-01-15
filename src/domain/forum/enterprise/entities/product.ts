import { Optional } from 'src/core/types/optional'
import { Entity } from '../../../../core/entities/entity'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'

export interface ProductProps {
  title: string
  description: string
  priceInCents: number
  status: 'available' | 'sold' | 'cancelled'
  soldAt?: Date | null
  availableAt?: Date | null
  ownerId: UniqueEntityID
  categoryId: UniqueEntityID
  createdAt?: Date
  updatedAt?: Date | null
}

export class Product extends Entity<ProductProps> {
  get title() {
    return this.props.title
  }

  get description() {
    return this.props.description
  }

  get priceInCents() {
    return this.props.priceInCents
  }

  get status() {
    return this.props.status
  }

  get soldAt() {
    return this.props.soldAt
  }

  get availableAt() {
    return this.props.availableAt
  }

  get ownerId() {
    return this.props.ownerId
  }

  get categoryId() {
    return this.props.categoryId
  }

  get createdAt() {
    return this.props.createdAt || new Date()
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(
    props: Optional<ProductProps, 'createdAt' | 'status'>,
    id?: UniqueEntityID,
  ) {
    const product = new Product(
      {
        ...props,
        status: props.status ?? 'available',
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return product
  }
}
