import { Module } from '@nestjs/common'
import { PrismaService } from '../database/prisma/prisma.service'
import { PrismaSellerRepository } from './prisma/repositories/prisma-seller-repository'

@Module({
  providers: [PrismaService, PrismaSellerRepository],
  exports: [PrismaService, PrismaSellerRepository],
})
export class DatabaseModule {}
