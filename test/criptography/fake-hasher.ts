import { HasherComparer } from '../../src/domain/forum/application/criptography/hasher-comparer'
import { HasherGenerator } from '../../src/domain/forum/application/criptography/hasher-generator'

export class FakeHasher implements HasherGenerator, HasherComparer {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash
  }
}
