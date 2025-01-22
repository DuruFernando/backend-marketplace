import { ProductDetails } from '../../../domain/forum/enterprise/entities/value-objects/product-details'
import { AttachmentPresenter } from './attachment-presenter'

export class ProductDetailPresenter {
  static toHTTP(productDetails: ProductDetails) {
    return {
      product: {
        id: productDetails.product.id.toString(),
        title: productDetails.product.title,
        description: productDetails.product.description,
        priceInCents: productDetails.product.priceInCents,
        status: productDetails.product.status,
      },
      owner: {
        id: productDetails.owner.id,
        name: productDetails.owner.name,
        phone: productDetails.owner.phone,
        email: productDetails.owner.email,
        avatar: productDetails.owner.avatar,
      },
      category: {
        id: productDetails.category.id,
        title: productDetails.category.title,
        slug: productDetails.category.slug,
      },
      attachments: productDetails.attachments.map(AttachmentPresenter.toHTTP),
    }
  }
}
