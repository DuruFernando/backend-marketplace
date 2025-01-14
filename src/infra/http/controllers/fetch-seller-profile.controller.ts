import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../../auth/jwt.auth.guard'
import { UserPayload } from '../../../infra/auth/jwt.strategy'
import { CurrentUser } from '../../../infra/auth/current-user-decorator'
import { FetchSellerProfileUseCase } from '../../../domain/forum/application/use-cases/fetch-seller-profile'
import { UniqueEntityID } from '../../../core/entities/unique-entity-id'
import { SellerProfilePresenter } from '../presenters/seller-profile-presenter'

@Controller('sellers/me')
@UseGuards(JwtAuthGuard)
export class FetchSellerProfileController {
  constructor(private fetchSellerProfile: FetchSellerProfileUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload) {
    const userId = new UniqueEntityID(user.sub)

    const result = await this.fetchSellerProfile.execute(userId)

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    if (!result.value.seller) {
      throw new BadRequestException()
    }

    return {
      seller: SellerProfilePresenter.toHTTP(result.value.seller),
    }
  }
}
