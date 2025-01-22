import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { GetProductByIdUseCase } from '../../../domain/forum/application/use-cases/get-product-by-id'
import { ProductDetailPresenter } from '../presenters/product-detail-presenter'

@Controller('/products/:id')
export class GetProductByIdController {
  constructor(private getProductById: GetProductByIdUseCase) {}

  @Get()
  async handle(@Param('id') id: string) {
    const result = await this.getProductById.execute({
      id,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      product: ProductDetailPresenter.toHTTP(result.value.product),
    }
  }
}
