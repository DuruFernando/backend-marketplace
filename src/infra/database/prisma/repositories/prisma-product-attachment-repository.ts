import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { ProductAttachmentsRepository } from '../../../../domain/forum/application/repositories/product-attachments-repository'
import { ProductAttachment } from '../../../../domain/forum/enterprise/entities/product-attachment'
import { PrismaProductAttachmentMapper } from '../mappers/prisma-product-attachment-mapper'

@Injectable()
export class PrismaProductAttachmentsRepository
  implements ProductAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByProductId(productId: string): Promise<ProductAttachment[]> {
    const productAttachments = await this.prisma.attachment.findMany({
      where: {
        productId,
      },
    })

    return productAttachments.map(PrismaProductAttachmentMapper.toDomain)
  }

  async createMany(attachments: ProductAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    const data = PrismaProductAttachmentMapper.toPrismaUpdateMany(attachments)

    await this.prisma.attachment.updateMany(data)
  }

  async deleteMany(attachments: ProductAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    const attachmentsIds = attachments.map((attachment) =>
      attachment.id.toString(),
    )

    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentsIds,
        },
      },
    })
  }

  async deleteManyByProductId(productId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        productId,
      },
    })
  }
}
