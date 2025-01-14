import { Module } from '@nestjs/common'
import { CreateAccountController } from './controllers/create-account.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateCategoryController } from './controllers/create-category.controller'
import { CreateProductController } from './controllers/create-product.controller'
import { FetchAllProductsController } from './controllers/fetch-all-products.controller'
import { DatabaseModule } from '../database/database.module'
import { FetchSellerProfileController } from './controllers/fetch-seller-profile.controller'
import { FetchSellerProfileUseCase } from '../../domain/forum/application/use-cases/fetch-seller-profile'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateCategoryController,
    CreateProductController,
    FetchAllProductsController,
    FetchSellerProfileController,
  ],
  providers: [FetchSellerProfileUseCase],
})
export class HttpModule {}
