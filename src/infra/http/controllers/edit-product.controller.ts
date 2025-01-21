import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { CurrentUser } from '../../auth/current-user-decorator'
import { JwtAuthGuard } from '../../auth/jwt.auth.guard'
import { UserPayload } from '../../auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { z } from 'zod'
import { EditProductUseCase } from '../../../domain/forum/application/use-cases/edit-product'

const editProductBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  priceInCents: z.coerce.number(),
  categoryId: z.string().uuid(),
  attachments: z.array(z.string().uuid()),
})

const bodyValidationBody = new ZodValidationPipe(editProductBodySchema)
type EditProductBodySchema = z.infer<typeof editProductBodySchema>

@Controller('/products/:id')
@UseGuards(JwtAuthGuard)
export class EditProductController {
  constructor(private editProduct: EditProductUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationBody) body: EditProductBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') productId: string,
  ) {
    const { title, description, priceInCents, categoryId, attachments } = body
    const userId = user.sub

    const result = await this.editProduct.execute({
      productId,
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
