import { UseCaseError } from '../../../../../core/errors/use-case-error'

export class ProductAlreadySoldError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Product "${identifier}" already sold`)
  }
}
