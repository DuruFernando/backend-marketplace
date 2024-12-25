import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { CreateCategoryUseCase } from './create-category'

let inMemoryCategoryRepository: InMemoryCategoryRepository
let sut: CreateCategoryUseCase

describe('Register Categories', () => {
  beforeEach(() => {
    inMemoryCategoryRepository = new InMemoryCategoryRepository()

    sut = new CreateCategoryUseCase(inMemoryCategoryRepository)
  })

  it('should be able to register a new category', async () => {
    const result = await sut.execute({
      title: 'Móveis',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      category: inMemoryCategoryRepository.items[0],
    })
  })
})
