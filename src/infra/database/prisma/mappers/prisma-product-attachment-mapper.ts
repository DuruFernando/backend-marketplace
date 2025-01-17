import { Prisma, Attachment as PrismaAttachment } from '@prisma/client'
import { ProductAttachment } from '../../../../domain/forum/enterprise/entities/product-attachment'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'

export class PrismaProductAttachmentMapper {
  static toDomain(raw: PrismaAttachment): ProductAttachment {
    if (!raw.productId) {
      throw new Error('Invalid attachment type')
    }

    return ProductAttachment.create(
      {
        attachmentId: new UniqueEntityID(raw.id),
        productId: new UniqueEntityID(raw.productId),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrismaUpdateMany(
    attachments: ProductAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentsIds = attachments.map((attachment) =>
      attachment.attachmentId.toString(),
    )

    return {
      where: {
        id: {
          in: attachmentsIds,
        },
      },
      data: {
        productId: attachments[0].productId.toString(),
      },
    }
  }
}
