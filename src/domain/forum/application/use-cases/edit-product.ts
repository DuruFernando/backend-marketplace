import { Injectable } from '@nestjs/common'
import { Either, left, right } from '../../../../core/either'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { Product } from '../../enterprise/entities/product'
import { ProductRepository } from '../repositories/product-repository'
import { ProductAttachmentsRepository } from '../repositories/product-attachments-repository'
import { ProductAttachmentList } from '../../enterprise/entities/product-attachment-list'
import { ProductAttachment } from '../../enterprise/entities/product-attachment'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'

interface EditProductUseCaseRequest {
  productId: string
  title: string
  description: string
  priceInCents: number
  status: 'available' | 'sold' | 'cancelled'
  soldAt?: Date | null
  availableAt?: Date | null
  ownerId: string
  categoryId: string
  attachmentsIds: string[]
}

type EditProductUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    product: Product
  }
>

@Injectable()
export class EditProductUseCase {
  constructor(
    private productsRepository: ProductRepository,
    private productAttachmentsRepository: ProductAttachmentsRepository,
  ) {}

  async execute({
    productId,
    title,
    description,
    priceInCents,
    status,
    ownerId,
    categoryId,
    attachmentsIds,
  }: EditProductUseCaseRequest): Promise<EditProductUseCaseResponse> {
    const product = await this.productsRepository.findById(productId)

    if (!product) {
      return left(new ResourceNotFoundError())
    }

    if (ownerId !== product.ownerId.toString()) {
      return left(new NotAllowedError())
    }

    const currentProductAttachments =
      await this.productAttachmentsRepository.findManyByProductId(productId)

    const productAttachmentList = new ProductAttachmentList(
      currentProductAttachments,
    )

    const productAttachments = attachmentsIds.map((attachmentId) => {
      return ProductAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        productId: product.id,
      })
    })

    productAttachmentList.update(productAttachments)

    product.attachments = productAttachmentList
    product.title = title
    product.description = description
    product.priceInCents = priceInCents
    product.categoryId = new UniqueEntityID(categoryId)
    product.status = status
    product.soldAt = status === 'sold' ? new Date() : null

    if (product.status !== 'available' && status === 'available') {
      product.availableAt = new Date()
    }

    await this.productsRepository.save(product)

    return right({
      product,
    })
  }
}
