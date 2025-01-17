import { Optional } from 'src/core/types/optional'
import { Entity } from '../../../../core/entities/entity'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'
import { ProductAttachmentList } from './product-attachment-list'

export interface ProductProps {
  title: string
  description: string
  priceInCents: number
  status: 'available' | 'sold' | 'cancelled'
  soldAt?: Date | null
  availableAt?: Date | null
  ownerId: UniqueEntityID
  categoryId: UniqueEntityID
  attachments: ProductAttachmentList
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

  get attachments() {
    return this.props.attachments
  }

  get createdAt() {
    return this.props.createdAt || new Date()
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set title(title: string) {
    this.props.title = title
    this.touch()
  }

  set description(description: string) {
    this.props.description = description
    this.touch()
  }

  set priceInCents(priceInCents: number) {
    this.props.priceInCents = priceInCents
    this.touch()
  }

  set status(status: 'available' | 'sold' | 'cancelled') {
    this.props.status = status
    this.touch()
  }

  set soldAt(soldAt: Date | null | undefined) {
    this.props.soldAt = soldAt
    this.touch()
  }

  set availableAt(availableAt: Date | null | undefined) {
    this.props.availableAt = availableAt
    this.touch()
  }

  set categoryId(categoryId: UniqueEntityID) {
    this.props.categoryId = categoryId
    this.touch()
  }

  set attachments(attachments: ProductAttachmentList) {
    this.props.attachments = attachments
    this.touch()
  }

  static create(
    props: Optional<ProductProps, 'createdAt' | 'status' | 'attachments'>,
    id?: UniqueEntityID,
  ) {
    const product = new Product(
      {
        ...props,
        status: props.status ?? 'available',
        createdAt: props.createdAt ?? new Date(),
        attachments: props.attachments ?? new ProductAttachmentList(),
      },
      id,
    )

    return product
  }
}
