import { Injectable } from '@nestjs/common'
import { ProductDetails } from '../../enterprise/entities/value-objects/product-details'
import { Either, left, right } from '../../../../core/either'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import { ProductRepository } from '../repositories/product-repository'

interface GetProductByIdUseCaseRequest {
  id: string
}

type GetProductByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    product: ProductDetails
  }
>

@Injectable()
export class GetProductByIdUseCase {
  constructor(private productsRepository: ProductRepository) {}

  async execute({
    id,
  }: GetProductByIdUseCaseRequest): Promise<GetProductByIdUseCaseResponse> {
    const product = await this.productsRepository.findDetailById(id)

    if (!product) {
      return left(new ResourceNotFoundError())
    }

    return right({
      product,
    })
  }
}
