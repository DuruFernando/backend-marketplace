import { Module } from '@nestjs/common'
import { PrismaService } from '../database/prisma/prisma.service'
import { PrismaSellerRepository } from './prisma/repositories/prisma-seller-repository'
import { SellerRepository } from '../../domain/forum/application/repositories/seller-repository'
import { ProductRepository } from '../../domain/forum/application/repositories/product-repository'
import { PrismaProductRepository } from './prisma/repositories/prisma-product-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: SellerRepository,
      useClass: PrismaSellerRepository,
    },
    {
      provide: ProductRepository,
      useClass: PrismaProductRepository,
    },
  ],
  exports: [PrismaService, SellerRepository, ProductRepository],
})
export class DatabaseModule {}
