import { Product } from '../../enterprise/entities/product'
import { ProductDetails } from '../../enterprise/entities/value-objects/product-details'

export abstract class ProductRepository {
  abstract findById(id: string): Promise<Product | null>
  abstract findDetailById(id: string): Promise<ProductDetails | null>
  abstract findAll(): Promise<Product[]>
  abstract create(product: Product): Promise<void>
  abstract save(product: Product): Promise<void>
}
