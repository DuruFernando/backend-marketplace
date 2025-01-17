import { ProductAttachment } from '../../src/domain/forum/enterprise/entities/product-attachment'
import { ProductAttachmentsRepository } from '../../src/domain/forum/application/repositories/product-attachments-repository'

export class InMemoryProductAttachmentsRepository
  implements ProductAttachmentsRepository
{
  public items: ProductAttachment[] = []

  async findManyByProductId(productId: string) {
    const productAttachments = this.items.filter(
      (item) => item.productId.toString() === productId,
    )

    return productAttachments
  }

  async createMany(attachments: ProductAttachment[]): Promise<void> {
    this.items.push(...attachments)
  }

  async deleteMany(attachments: ProductAttachment[]): Promise<void> {
    const productAttachments = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item))
    })

    this.items = productAttachments
  }

  async deleteManyByProductId(productId: string) {
    const productAttachments = this.items.filter(
      (item) => item.productId.toString() !== productId,
    )

    this.items = productAttachments
  }
}
