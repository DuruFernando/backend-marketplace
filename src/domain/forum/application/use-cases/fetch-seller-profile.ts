import { Either, right } from '../../../../core/either'
import { Injectable } from '@nestjs/common'
import { Seller } from '../../enterprise/entities/seller'
import { SellerRepository } from '../repositories/seller-repository'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'

type FetchSellerProfileUseCaseResponse = Either<
  null,
  {
    seller: Seller | null
  }
>

@Injectable()
export class FetchSellerProfileUseCase {
  constructor(private sellerRepository: SellerRepository) {}

  async execute(
    id: UniqueEntityID,
  ): Promise<FetchSellerProfileUseCaseResponse> {
    const seller = await this.sellerRepository.findMe(id)

    return right({
      seller,
    })
  }
}
