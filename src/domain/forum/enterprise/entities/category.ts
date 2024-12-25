import { Optional } from 'src/core/types/optional'
import { Entity } from '../../../../core/entities/entity'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'
import { Slug } from './value-objects/slug'

export interface CategoryProps {
  title: string
  slug: Slug
  createdAt?: Date
  updatedAt?: Date | null
}

export class Category extends Entity<CategoryProps> {
  get title() {
    return this.props.title
  }

  get slug() {
    return this.props.slug
  }

  get createdAt() {
    return this.props.createdAt || new Date()
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(
    props: Optional<CategoryProps, 'createdAt' | 'slug'>,
    id?: UniqueEntityID,
  ) {
    const category = new Category(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return category
  }
}
