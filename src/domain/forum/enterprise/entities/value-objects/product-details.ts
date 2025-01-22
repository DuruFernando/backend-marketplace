import { UniqueEntityID } from '../../../../../core/entities/unique-entity-id'
import { ValueObject } from '../../../../../core/entities/value-object'
import { Attachment } from '../attachment'

export interface ProductDetailsProps {
  product: {
    id: UniqueEntityID
    title: string
    description: string
    priceInCents: number
    status: 'available' | 'sold' | 'cancelled'
    owner: {
      id: UniqueEntityID
      name: string
      phone: string
      email: string
      avatar?: {
        id?: UniqueEntityID
        url?: string
      }
    }
    category: {
      id: UniqueEntityID
      title: string
      slug: string
    }
    attachments: Attachment[]
  }
}

export class ProductDetails extends ValueObject<ProductDetailsProps> {
  get title() {
    return this.props.product.title
  }

  get description() {
    return this.props.product.description
  }

  get priceInCents() {
    return this.props.product.priceInCents
  }

  get status() {
    return this.props.product.status
  }

  get owner() {
    return this.props.product.owner
  }

  get category() {
    return this.props.product.category
  }

  get attachments() {
    return this.props.product.attachments
  }

  static create(props: ProductDetailsProps) {
    return new ProductDetails(props)
  }
}
