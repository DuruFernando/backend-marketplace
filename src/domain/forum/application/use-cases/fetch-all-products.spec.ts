import { InMemoryAttachmentRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryProductAttachmentsRepository } from 'test/repositories/in-memory-product-attachments-repository'
import { InMemoryProductRepository } from 'test/repositories/in-memory-product-repository'
import { InMemorySellerRepository } from 'test/repositories/in-memory-seller-repository'
import { FetchAllProductsUseCase } from './fetch-all-products'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { makeProduct } from 'test/factories/make-product'
import { makeSeller } from 'test/factories/make-seller'
import { makeCategory } from 'test/factories/make-category'
import { Slug } from '../../enterprise/entities/value-objects/slug'

let inMemoryProductsAttachmentsRepository: InMemoryProductAttachmentsRepository
let inMemoryProductRepository: InMemoryProductRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentRepository
let inMemorySellerRepository: InMemorySellerRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let sut: FetchAllProductsUseCase

describe('Fetch Recent Productss', () => {
  beforeEach(() => {
    inMemoryProductsAttachmentsRepository =
      new InMemoryProductAttachmentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentRepository()
    inMemorySellerRepository = new InMemorySellerRepository()
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    inMemoryProductRepository = new InMemoryProductRepository(
      inMemoryProductsAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemorySellerRepository,
      inMemoryCategoryRepository,
    )
    sut = new FetchAllProductsUseCase(inMemoryProductRepository)
  })

  it('should be able to fetch recent products', async () => {
    const seller = makeSeller({
      name: 'John Doe',
    })

    inMemorySellerRepository.items.push(seller)

    const newCategory = makeCategory({
      title: 'móvel',
      slug: Slug.create('movel'),
    })

    await inMemoryCategoryRepository.create(newCategory)

    const newProduct = makeProduct({
      title: 'mesa de centro',
      ownerId: seller.id,
      categoryId: newCategory.id,
      createdAt: new Date(2024, 0, 20),
    })

    const newProduct2 = makeProduct({
      title: 'Cadeira',
      ownerId: seller.id,
      categoryId: newCategory.id,
      createdAt: new Date(2024, 0, 18),
    })

    const newProduct3 = makeProduct({
      title: 'Mesa de jantar',
      ownerId: seller.id,
      categoryId: newCategory.id,
      createdAt: new Date(2024, 0, 23),
    })

    await inMemoryProductRepository.create(newProduct)
    await inMemoryProductRepository.create(newProduct2)
    await inMemoryProductRepository.create(newProduct3)

    const result = await sut.execute({
      page: 1,
      q: '',
      status: 'available',
    })

    expect(result.value?.products).toEqual([
      expect.objectContaining({ title: 'Mesa de jantar' }),
      expect.objectContaining({ title: 'mesa de centro' }),
      expect.objectContaining({ title: 'Cadeira' }),
    ])
  })

  it('should be able to fetch paginated recent products', async () => {
    const seller = makeSeller({
      name: 'John Doe',
    })

    inMemorySellerRepository.items.push(seller)

    const newCategory = makeCategory({
      title: 'móvel',
      slug: Slug.create('movel'),
    })

    await inMemoryCategoryRepository.create(newCategory)
    for (let i = 1; i <= 22; i++) {
      const newProduct = makeProduct({
        title: 'mesa de centro',
        ownerId: seller.id,
        categoryId: newCategory.id,
        createdAt: new Date(2024, 0, 20),
      })

      await inMemoryProductRepository.create(newProduct)
    }

    const result = await sut.execute({
      page: 2,
      q: '',
      status: 'available',
    })

    expect(result.value?.products).toHaveLength(2)
  })
})
