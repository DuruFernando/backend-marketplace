import {
  Product as PrismaProduct,
  User as PrismaUser,
  Category as PrismaCategory,
  Attachment as PrismaAttachment,
} from '@prisma/client'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'
import { ProductDetails } from '../../../../domain/forum/enterprise/entities/value-objects/product-details'
import { PrismaAttachmentMapper } from './prisma-attachment-mapper'

type PrismaProductDetails = PrismaProduct & {
  owner: PrismaUser & {
    attachment?: {
      id: string
      url: string
    }
  }
  category: PrismaCategory
  attachments: PrismaAttachment[]
}

export class PrismaProductDetailsMapper {
  static toDomain(raw: PrismaProductDetails): ProductDetails {
    return ProductDetails.create({
      product: {
        id: new UniqueEntityID(raw.id),
        title: raw.title,
        description: raw.description,
        priceInCents: raw.priceInCents,
        status: raw.status,
        owner: {
          ...raw.owner,
          avatar: {
            id: new UniqueEntityID(raw.owner.attachment?.id),
            url: raw.owner.attachment?.url,
          },
          id: new UniqueEntityID(raw.owner.id),
        },
        category: {
          ...raw.category,
          id: new UniqueEntityID(raw.category.id),
        },
        attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
      },
    })
  }
}
