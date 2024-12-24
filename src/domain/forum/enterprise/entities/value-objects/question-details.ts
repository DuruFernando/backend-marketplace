import { UniqueEntityID } from '../../../../../core/entities/unique-entity-id'
import { ValueObject } from '../../../../../core/entities/value-object'

export interface ProductDetailsProps {
  product: {
    id: UniqueEntityID
    title: string
    description: string
    priceInCents: string
    createdAt: Date
    updatedAt?: Date | null
    bestAnswerId?: UniqueEntityID | null
  }
  author: {
    id: UniqueEntityID
    name: string
  }
}

export class ProductDetails extends ValueObject<ProductDetailsProps> {
  get product() {
    return this.props.product
  }

  get author() {
    return this.props.author
  }

  static create(props: ProductDetailsProps) {
    return new ProductDetails(props)
  }
}
