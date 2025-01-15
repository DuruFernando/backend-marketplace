import { Either, right } from '../../../../core/either'
import { Injectable } from '@nestjs/common'
import { Product } from '../../enterprise/entities/product'
import { ProductRepository } from '../repositories/product-repository'
import { ProductAlreadyExistsError } from './errors/product-already-exists-error'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'

interface CreateProductUseCaseRequest {
  title: string
  description: string
  priceInCents: number
  status: 'available' | 'sold' | 'cancelled'
  soldAt?: Date | null
  availableAt?: Date | null
  ownerId: string
  categoryId: string
}

type CreateProductUseCaseResponse = Either<
  ProductAlreadyExistsError,
  {
    product: Product
  }
>

@Injectable()
export class CreateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({
    title,
    description,
    priceInCents,
    status,
    soldAt,
    availableAt,
    ownerId,
    categoryId,
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    const product = Product.create({
      title,
      description,
      priceInCents,
      status,
      soldAt,
      availableAt,
      ownerId: new UniqueEntityID(ownerId),
      categoryId: new UniqueEntityID(categoryId),
    })

    await this.productRepository.create(product)

    return right({
      product,
    })
  }
}
