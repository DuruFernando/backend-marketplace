import { InMemoryProductRepository } from '../../../../../test/repositories/in-memory-product-repository'
import { InMemoryProductAttachmentsRepository } from '../../../../../test/repositories/in-memory-product-attachments-repository'
import { EditProductUseCase } from './edit-product'
import { makeProduct } from '../../../../../test/factories/make-product'
import { UniqueEntityID } from '../../../../../src/core/entities/unique-entity-id'
import { makeProductAttachment } from '../../../../../test/factories/make-product-attachment'
import { makeCategory } from '../../../../../test/factories/make-category'
import { NotAllowedError } from '../../../../../src/core/errors/errors/not-allowed-error'

let inMemoryProductsRepository: InMemoryProductRepository
let inMemoryProductAttachmentsRepository: InMemoryProductAttachmentsRepository
let sut: EditProductUseCase

describe('Edit Product', () => {
  beforeEach(() => {
    inMemoryProductAttachmentsRepository =
      new InMemoryProductAttachmentsRepository()
    inMemoryProductsRepository = new InMemoryProductRepository(
      inMemoryProductAttachmentsRepository,
    )

    sut = new EditProductUseCase(
      inMemoryProductsRepository,
      inMemoryProductAttachmentsRepository,
    )
  })

  it('should be able to edit a product', async () => {
    const category = makeCategory()

    const newProduct = makeProduct(
      {
        ownerId: new UniqueEntityID('author-1'),
        categoryId: category.id,
      },
      new UniqueEntityID('product-1'),
    )

    await inMemoryProductsRepository.create(newProduct)

    inMemoryProductAttachmentsRepository.items.push(
      makeProductAttachment({
        productId: newProduct.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeProductAttachment({
        productId: newProduct.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    await sut.execute({
      productId: newProduct.id.toValue(),
      ownerId: 'author-1',
      title: 'Mesa de centro',
      description: 'mesa para sala',
      categoryId: category.id.toString(),
      priceInCents: 24999,
      status: 'available',
      attachmentsIds: ['1', '3'],
    })

    expect(inMemoryProductsRepository.items[0]).toMatchObject({
      title: 'Mesa de centro',
      description: 'mesa para sala',
    })

    expect(
      inMemoryProductsRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(
      inMemoryProductsRepository.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ])
  })

  it('should not be able to edit a product from another user', async () => {
    const category = makeCategory()

    const newProduct = makeProduct(
      {
        ownerId: new UniqueEntityID('author-1'),
        categoryId: category.id,
      },
      new UniqueEntityID('product-1'),
    )

    await inMemoryProductsRepository.create(newProduct)

    const result = await sut.execute({
      productId: newProduct.id.toValue(),
      ownerId: 'author-2',
      title: 'Mesa de centro',
      description: 'mesa para sala',
      categoryId: category.id.toString(),
      priceInCents: 24999,
      status: 'available',
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should sync new and removed attachments when editing a product', async () => {
    const category = makeCategory()

    const newProduct = makeProduct(
      {
        ownerId: new UniqueEntityID('author-1'),
        categoryId: category.id,
      },
      new UniqueEntityID('product-1'),
    )

    await inMemoryProductsRepository.create(newProduct)

    inMemoryProductAttachmentsRepository.items.push(
      makeProductAttachment({
        productId: newProduct.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeProductAttachment({
        productId: newProduct.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    const result = await sut.execute({
      productId: newProduct.id.toValue(),
      ownerId: 'author-1',
      title: 'Mesa de centro',
      description: 'mesa para sala',
      categoryId: category.id.toString(),
      priceInCents: 24999,
      status: 'available',
      attachmentsIds: ['1', '3'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryProductAttachmentsRepository.items).toHaveLength(2)
    expect(inMemoryProductAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('3'),
        }),
      ]),
    )
  })
})
