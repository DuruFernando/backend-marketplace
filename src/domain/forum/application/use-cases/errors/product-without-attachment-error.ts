import { UseCaseError } from '../../../../../core/errors/use-case-error'

export class ProductWithoutAttachmentError
  extends Error
  implements UseCaseError
{
  constructor(identifier: string) {
    super(`Product "${identifier}" whitout an attachment`)
  }
}
