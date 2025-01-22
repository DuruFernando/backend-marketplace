import { Either, right } from '../../../../core/either'
import { Injectable } from '@nestjs/common'
import { ProductRepository } from '../repositories/product-repository'
import { ProductParams } from '../../../../core/repositories/product-params'
import { ProductDetails } from '../../enterprise/entities/value-objects/product-details'

type FetchAllProductsUseCaseResponse = Either<
  null,
  {
    products: ProductDetails[]
  }
>

@Injectable()
export class FetchAllProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({
    page,
    q,
    status,
  }: ProductParams): Promise<FetchAllProductsUseCaseResponse> {
    const products = await this.productRepository.findAll({ page, q, status })

    return right({
      products,
    })
  }
}
