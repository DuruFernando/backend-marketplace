import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { FetchAllCategoriesUseCase } from './fetch-all-categories'
import { makeCategory } from 'test/factories/make-category'

let inMemoryCategoryRepository: InMemoryCategoryRepository
let sut: FetchAllCategoriesUseCase

describe('Fetch All Categories', () => {
  beforeEach(() => {
    inMemoryCategoryRepository = new InMemoryCategoryRepository()

    sut = new FetchAllCategoriesUseCase(inMemoryCategoryRepository)
  })

  it('should be able to fetch all categories', async () => {
    const category = makeCategory({
      title: 'Móveis',
    })
    inMemoryCategoryRepository.items.push(category)

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      categories: inMemoryCategoryRepository.items,
    })
  })
})
