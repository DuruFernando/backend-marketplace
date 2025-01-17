import { InMemoryProductRepository } from 'test/repositories/in-memory-product-repository'
import { CreateProductUseCase } from './create-product'
import { InMemoryProductAttachmentsRepository } from '../../../../../test/repositories/in-memory-product-attachments-repository'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
// import { InMemoryAttachmentRepository } from '../../../../../test/repositories/in-memory-attachments-repository'

let inMemoryProductRepository: InMemoryProductRepository
// let inMemoryAttachmentRepository: InMemoryAttachmentRepository
let inMemoryProductAttachmentsRepository: InMemoryProductAttachmentsRepository

let sut: CreateProductUseCase

describe('Register Products', () => {
  beforeEach(() => {
    // inMemoryAttachmentRepository = new InMemoryAttachmentRepository()
    inMemoryProductAttachmentsRepository =
      new InMemoryProductAttachmentsRepository()
    inMemoryProductRepository = new InMemoryProductRepository(
      inMemoryProductAttachmentsRepository,
    )

    sut = new CreateProductUseCase(inMemoryProductRepository)
  })

  it('should be able to register a new product with attachments', async () => {
    const result = await sut.execute({
      title: 'Sofá',
      description: 'Sofá de 3 lugares',
      priceInCents: 123456,
      status: 'available',
      ownerId: '10',
      categoryId: '1',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      product: inMemoryProductRepository.items[0],
    })
    expect(inMemoryProductAttachmentsRepository.items).toHaveLength(2)
    expect(inMemoryProductAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('2'),
        }),
      ]),
    )
  })
})
