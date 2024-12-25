import { Either, left, right } from '../../../../core/either'
import { Injectable } from '@nestjs/common'
import { CategoryAlreadyExistsError } from './errors/category-already-exists-error'
import { Category } from '../../enterprise/entities/category'
import { CategoryRepository } from '../repositories/category-repository'

interface CreateCategoryUseCaseRequest {
  title: string
}

type CreateCategoryUseCaseResponse = Either<
  CategoryAlreadyExistsError,
  {
    category: Category
  }
>

@Injectable()
export class CreateCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute({
    title,
  }: CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {
    const categoryWithSameTitle =
      await this.categoryRepository.findByTitle(title)

    if (categoryWithSameTitle) {
      return left(new CategoryAlreadyExistsError(title))
    }

    const category = Category.create({
      title,
    })

    await this.categoryRepository.create(category)

    return right({
      category,
    })
  }
}
