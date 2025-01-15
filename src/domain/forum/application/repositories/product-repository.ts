import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { Product } from '../../enterprise/entities/product'

export abstract class ProductRepository {
  abstract findById(id: UniqueEntityID): Promise<Product | null>
  abstract findAll(): Promise<Product[]>
  abstract create(product: Product): Promise<void>
  abstract save(product: Product): Promise<void>
}
