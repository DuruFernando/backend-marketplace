import { UseCaseError } from '../../errors/use-case-error'

export class NotAllowedError extends Error implements UseCaseError {
  constructor() {
    super('Not allowed')
  }
}
