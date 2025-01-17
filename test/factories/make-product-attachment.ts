import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '../../src/core/entities/unique-entity-id'
import { PrismaService } from '../../src/infra/database/prisma/prisma.service'
import {
  ProductAttachment,
  ProductAttachmentProps,
} from '../../src/domain/forum/enterprise/entities/product-attachment'

export function makeProductAttachment(
  override: Partial<ProductAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const productAttachment = ProductAttachment.create(
    {
      productId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return productAttachment
}

@Injectable()
export class ProductAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaProductAttachment(
    data: Partial<ProductAttachmentProps> = {},
  ): Promise<ProductAttachment> {
    const productAttachment = makeProductAttachment(data)

    await this.prisma.attachment.update({
      where: {
        id: productAttachment.attachmentId.toString(),
      },
      data: {
        productId: productAttachment.productId.toString(),
      },
    })

    return productAttachment
  }
}
