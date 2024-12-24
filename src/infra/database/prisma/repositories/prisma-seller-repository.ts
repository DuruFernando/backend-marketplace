import { Seller } from 'src/domain/forum/enterprise/entities/seller'
import { SellersRepository } from '../../../../../src/domain/forum/application/repositories/seller-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaSellerMapper } from '../mappers/prisma-seller-mapper'

@Injectable()
export class PrismaSellerRepository implements SellersRepository {
  constructor(private prisma: PrismaService) {}

  async findByPhone(phone: string): Promise<Seller | null> {
    const seller = await this.prisma.user.findUnique({
      where: {
        phone,
      },
    })

    if (!seller) {
      return null
    }

    return PrismaSellerMapper.toDomain(seller)
  }

  async findByEmail(email: string): Promise<Seller | null> {
    const seller = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!seller) {
      return null
    }

    return PrismaSellerMapper.toDomain(seller)
  }

  create(seller: Seller): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
