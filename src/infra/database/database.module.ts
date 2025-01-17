import { Module } from '@nestjs/common'
import { PrismaService } from '../database/prisma/prisma.service'
import { PrismaSellerRepository } from './prisma/repositories/prisma-seller-repository'
import { SellerRepository } from '../../domain/forum/application/repositories/seller-repository'
import { ProductRepository } from '../../domain/forum/application/repositories/product-repository'
import { PrismaProductRepository } from './prisma/repositories/prisma-product-repository'
import { AttachmentsRepository } from '../../domain/forum/application/repositories/attachments-repository'
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachment-repository'
import { ProductAttachmentsRepository } from '../../domain/forum/application/repositories/product-attachments-repository'
import { PrismaProductAttachmentsRepository } from './prisma/repositories/prisma-product-attachment-repository'

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
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    },
    {
      provide: ProductAttachmentsRepository,
      useClass: PrismaProductAttachmentsRepository,
    },
  ],
  exports: [
    PrismaService,
    SellerRepository,
    ProductRepository,
    AttachmentsRepository,
    ProductAttachmentsRepository,
  ],
})
export class DatabaseModule {}
