import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common'
import { CurrentUser } from '../../auth/current-user-decorator'
import { JwtAuthGuard } from '../../auth/jwt.auth.guard'
import { UserPayload } from '../../auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateProductUseCase } from '../../../domain/forum/application/use-cases/create-product'

const createProductBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  priceInCents: z.coerce.number(),
  categoryId: z.string().uuid(),
  attachments: z.array(z.string().uuid()),
})

const bodyValidationBody = new ZodValidationPipe(createProductBodySchema)
type CreateProductBodySchema = z.infer<typeof createProductBodySchema>

@Controller('/products')
@UseGuards(JwtAuthGuard)
export class CreateProductController {
  constructor(private createProduct: CreateProductUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationBody) body: CreateProductBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, description, priceInCents, categoryId, attachments } = body
    const userId = user.sub

    const result = await this.createProduct.execute({
      title,
      description,
      priceInCents,
      status: 'available',
      ownerId: userId,
      categoryId,
      attachmentsIds: attachments,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
