import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

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

@Controller('/products')
@UseGuards(JwtAuthGuard)
export class FetchAllProductsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query('page', pageQueryValidationPipe) page: PageQueryParamSchema,
    @Query('q', searchQueryValidationPipe) search: SearchQueryParamSchema,
  ) {
    const products = await this.prisma.product.findMany({
      where: {
        status: 'available',
        OR: [
          {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      },
      take: 1,
      skip: (page - 1) * 1,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return {
      products,
    }
  }
}