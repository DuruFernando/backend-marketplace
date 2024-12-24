import { InMemorySellerRepository } from '../../../../../test/repositories/in-memory-seller-repository'
import { RegisterSellerUseCase } from './register-seller'
import { FakeHasher } from 'test/criptography/fake-hasher'

let inMemorySellersRepository: InMemorySellerRepository
let fakerHasher: FakeHasher

let sut: RegisterSellerUseCase

describe('Register Sellers', () => {
  beforeEach(() => {
    inMemorySellersRepository = new InMemorySellerRepository()
    fakerHasher = new FakeHasher()

    sut = new RegisterSellerUseCase(inMemorySellersRepository, fakerHasher)
  })

  it('should be able to register a new seller', async () => {
    const result = await sut.execute({
      name: 'John Doe Seller',
      email: 'jodoeseller@gmail.com',
      phone: '11975775215',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      seller: inMemorySellersRepository.items[0],
    })
  })

  it('should hash seller password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe Seller',
      email: 'jodoeseller@gmail.com',
      phone: '11975775215',
      password: '123456',
    })

    const hashedPassword = await fakerHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemorySellersRepository.items[0].password).toEqual(hashedPassword)
  })
})
