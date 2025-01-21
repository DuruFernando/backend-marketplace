import { Product } from '../../enterprise/entities/product'

export abstract class ProductRepository {
  abstract findById(id: string): Promise<Product | null>
  abstract findAll(): Promise<Product[]>
  abstract create(product: Product): Promise<void>
  abstract save(product: Product): Promise<void>
}
