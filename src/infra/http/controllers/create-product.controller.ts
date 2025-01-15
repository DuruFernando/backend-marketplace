import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from '../../auth/current-user-decorator'
import { JwtAuthGuard } from '../../auth/jwt.auth.guard'
import { UserPayload } from '../../auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { PrismaService } from '../../database/prisma/prisma.service'
import { z } from 'zod'

const createProductBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  priceInCents: z.coerce.number(),
  categoryId: z.string().uuid(),
})

const bodyValidationBody = new ZodValidationPipe(createProductBodySchema)
type CreateProductBodySchema = z.infer<typeof createProductBodySchema>

@Controller('/products')
@UseGuards(JwtAuthGuard)
export class CreateProductController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationBody) body: CreateProductBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, description, priceInCents, categoryId } = body
    const userId = user.sub

    await this.prisma.product.create({
      data: {
        title,
        description,
        priceInCents,
        ownerId: userId,
        categoryId,
      },
    })
  }
}
