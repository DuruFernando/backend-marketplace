import { PaginationParams } from 'src/core/repositories/pagination-params'
import { Category } from '../../enterprise/entities/category'

export abstract class CategoryRepository {
  abstract findByTitle(title: string): Promise<Category | null>
  abstract findMany(params: PaginationParams): Promise<Category[] | null>
  abstract create(category: Category): Promise<void>
  abstract save(category: Category): Promise<void>
}
