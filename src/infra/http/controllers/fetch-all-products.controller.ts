import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Query,
} from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchAllProductsUseCase } from '../../../../src/domain/forum/application/use-cases/fetch-all-products'
import { ProductPresenter } from '../presenters/product-presenter'

const pageQueryParamsSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))
const pageQueryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema)
type PageQueryParamSchema = z.infer<typeof pageQueryParamsSchema>

const searchQueryParamsSchema = z.string().optional().default('')
const searchQueryValidationPipe = new ZodValidationPipe(searchQueryParamsSchema)
type SearchQueryParamSchema = z.infer<typeof searchQueryParamsSchema>

const statusParamsSchema = z
  .enum(['available', 'sold', 'cancelled'])
  .default('available')
const statusValidationPipe = new ZodValidationPipe(statusParamsSchema)
type StatusParamSchema = z.infer<typeof statusParamsSchema>

@Controller('/products')
export class FetchAllProductsController {
  constructor(private fetchAllProducts: FetchAllProductsUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query('page', pageQueryValidationPipe) page: PageQueryParamSchema,
    @Query('q', searchQueryValidationPipe) q: SearchQueryParamSchema,
    @Query('status', statusValidationPipe) status: StatusParamSchema,
  ) {
    const result = await this.fetchAllProducts.execute({
      page,
      q,
      status,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { products } = result.value

    const produto = products.map(ProductPresenter.toHTTP)

    return {
      products: produto,
    }
  }
}
