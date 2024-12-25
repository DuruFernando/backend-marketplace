import { Entity } from '../../../../core/entities/entity'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'

export interface SellerProps {
  name: string
  email: string
  phone: string
  password: string
  createdAt?: Date
  updatedAt?: Date | null
}

export class Seller extends Entity<SellerProps> {
  get name() {
    return this.props.name
  }

  get phone() {
    return this.props.phone
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: SellerProps, id?: UniqueEntityID) {
    const seller = new Seller(props, id)

    return seller
  }
}
