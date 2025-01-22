import { InMemoryCategoryRepository } from '../../../../../test/repositories/in-memory-category-repository'
import { InMemoryAttachmentRepository } from '../../../../../test/repositories/in-memory-attachments-repository'
import { InMemoryProductAttachmentsRepository } from '../../../../../test/repositories/in-memory-product-attachments-repository'
import { InMemoryProductRepository } from '../../../../../test/repositories/in-memory-product-repository'
import { InMemorySellerRepository } from '../../../../../test/repositories/in-memory-seller-repository'
import { GetProductByIdUseCase } from './get-product-by-id'
import { makeSeller } from '../../../../../test/factories/make-seller'
import { makeProduct } from '../../../../../test/factories/make-product'
import { makeAttachment } from '../../../../../test/factories/make-attachment'
import { makeProductAttachment } from '../../../../../test/factories/make-product-attachment'
import { makeCategory } from '../../../../../test/factories/make-category'
import { Slug } from '../../enterprise/entities/value-objects/slug'

let inMemoryProductAttachmentsRepository: InMemoryProductAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentRepository
let inMemorySellerRepository: InMemorySellerRepository
let inMemoryProductRepository: InMemoryProductRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let sut: GetProductByIdUseCase

describe('Get Product By Id', () => {
  beforeEach(() => {
    inMemoryProductAttachmentsRepository =
      new InMemoryProductAttachmentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentRepository()
    inMemorySellerRepository = new InMemorySellerRepository()
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    inMemoryProductRepository = new InMemoryProductRepository(
      inMemoryProductAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemorySellerRepository,
      inMemoryCategoryRepository,
    )
    sut = new GetProductByIdUseCase(inMemoryProductRepository)
  })

  it('should be able to get a product by id', async () => {
    const seller = makeSeller({
      name: 'John Doe',
    })

    inMemorySellerRepository.items.push(seller)

    const newCategory = makeCategory({
      title: 'móvel',
      slug: Slug.create('mesa-de-centro'),
    })

    await inMemoryCategoryRepository.create(newCategory)

    const newProduct = makeProduct({
      title: 'mesa de centro',
      ownerId: seller.id,
      categoryId: newCategory.id,
    })

    await inMemoryProductRepository.create(newProduct)

    const attachment = makeAttachment({
      title: 'title Attch',
    })

    inMemoryAttachmentsRepository.items.push(attachment)

    inMemoryProductAttachmentsRepository.items.push(
      makeProductAttachment({
        attachmentId: attachment.id,
        productId: newProduct.id,
      }),
    )

    const result = await sut.execute({
      id: newProduct.id.toString(),
    })

    console.log(result)

    expect(result.value).toEqual({
      product: expect.objectContaining({
        title: 'mesa de centro',
        owner: expect.objectContaining({
          name: 'John Doe',
        }),
        category: expect.objectContaining({
          title: 'móvel',
        }),
        attachments: expect.arrayContaining([
          expect.objectContaining({
            title: 'title Attch',
          }),
        ]),
      }),
    })
  })
})
