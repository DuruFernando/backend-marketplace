import { Module } from '@nestjs/common'
import { PrismaService } from '../database/prisma/prisma.service'
import { PrismaSellerRepository } from './prisma/repositories/prisma-seller-repository'
import { SellerRepository } from '../../domain/forum/application/repositories/seller-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: SellerRepository,
      useClass: PrismaSellerRepository,
    },
  ],
  exports: [PrismaService, SellerRepository],
})
export class DatabaseModule {}
