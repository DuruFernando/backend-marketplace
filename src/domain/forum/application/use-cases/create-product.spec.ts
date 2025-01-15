import { InMemoryProductRepository } from 'test/repositories/in-memory-product-repository'
import { CreateProductUseCase } from './create-product'

let inMemoryProductRepository: InMemoryProductRepository
let sut: CreateProductUseCase

describe('Register Products', () => {
  beforeEach(() => {
    inMemoryProductRepository = new InMemoryProductRepository()

    sut = new CreateProductUseCase(inMemoryProductRepository)
  })

  it('should be able to register a new product', async () => {
    const result = await sut.execute({
      title: 'Sofá',
      description: 'Sofá de 3 lugares',
      priceInCents: 123456,
      status: 'available',
      ownerId: '10',
      categoryId: '1',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      product: inMemoryProductRepository.items[0],
    })
  })
})
