import { InMemorySellerRepository } from 'test/repositories/in-memory-seller-repository'
import { FetchSellerProfileUseCase } from './fetch-seller-profile'
import { makeSeller } from 'test/factories/make-seller'

let inMemorySellerRepository: InMemorySellerRepository
let sut: FetchSellerProfileUseCase

describe('Fetch Seller Profile', () => {
  beforeEach(() => {
    inMemorySellerRepository = new InMemorySellerRepository()

    sut = new FetchSellerProfileUseCase(inMemorySellerRepository)
  })

  it('should be able to fetch the seller', async () => {
    const category = makeSeller()
    inMemorySellerRepository.items.push(category)

    const result = await sut.execute(category.id)

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      seller: inMemorySellerRepository.items[0],
    })
  })
})
