import { SellersRepository } from '../repositories/seller-repository'
import { Either, left, right } from '../../../../core/either'
import { Injectable } from '@nestjs/common'
import { Seller } from '../../enterprise/entities/seller'
import { HasherGenerator } from '../criptography/hasher-generator'
import { SellerAlreadyExistsError } from './errors/seller-already-exists-error'

interface RegisterSellerUseCaseRequest {
  name: string
  email: string
  phone: string
  password: string
}

type RegisterSellerUseCaseResponse = Either<
  SellerAlreadyExistsError,
  {
    seller: Seller
  }
>

@Injectable()
export class RegisterSellerUseCase {
  constructor(
    private sellersRepository: SellersRepository,
    private hashGenerator: HasherGenerator,
  ) {}

  async execute({
    name,
    email,
    phone,
    password,
  }: RegisterSellerUseCaseRequest): Promise<RegisterSellerUseCaseResponse> {
    const sellerWithSameEmail = await this.sellersRepository.findByEmail(email)

    if (sellerWithSameEmail) {
      return left(new SellerAlreadyExistsError(email))
    }

    const sellerWithSamePhone = await this.sellersRepository.findByPhone(phone)

    if (sellerWithSamePhone) {
      return left(new SellerAlreadyExistsError(phone))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const seller = Seller.create({
      name,
      email,
      phone,
      password: hashedPassword,
    })

    await this.sellersRepository.create(seller)

    return right({
      seller,
    })
  }
}
