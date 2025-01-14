import { Seller } from '../../../domain/forum/enterprise/entities/seller'

export class SellerProfilePresenter {
  static toHTTP(seller: Seller) {
    return {
      id: seller.id.toString(),
      name: seller.name,
      phone: seller.phone,
      email: seller.email,
      createdAt: seller.createdAt,
      updatedAt: seller.updatedAt,
    }
  }
}
