import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { CurrentUser } from 'src/auth/current-user-decorator'
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard'
import { UserPayload } from 'src/auth/jwt.strategy'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const createProductBodySchema = z.object({
  title: z.string(),
  categoryId: z.string().uuid(),
  description: z.string(),
  priceInCents: z.coerce.number(),
  status: z.string(),
})

type CreateProductBodySchema = z.infer<typeof createProductBodySchema>

@Controller('/products')
@UseGuards(JwtAuthGuard)
export class CreateProductController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createProductBodySchema))
  async handle(
    @Body() body: CreateProductBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, description, priceInCents, status, categoryId } = body
    const userId = user.sub

    await this.prisma.product.create({
      data: {
        title,
        description,
        priceInCents,
        status,
        ownerId: userId,
        categoryId,
      },
    })
  }
}