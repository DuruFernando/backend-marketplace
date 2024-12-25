import { Either, right } from '../../../../core/either'
import { Injectable } from '@nestjs/common'
import { Category } from '../../enterprise/entities/category'
import { CategoryRepository } from '../repositories/category-repository'

type FetchAllCategoriesUseCaseResponse = Either<
  null,
  {
    categories: Category[]
  }
>

@Injectable()
export class FetchAllCategoriesUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute(): Promise<FetchAllCategoriesUseCaseResponse> {
    const categories = await this.categoryRepository.findAll()

    return right({
      categories,
    })
  }
}
