import { Module } from '@nestjs/common'
import { CreateAccountController } from './controllers/create-account.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateCategoryController } from './controllers/create-category.controller'
import { CreateProductController } from './controllers/create-product.controller'
import { FetchAllProductsController } from './controllers/fetch-all-products.controller'
import { DatabaseModule } from '../database/database.module'
import { FetchSellerProfileController } from './controllers/fetch-seller-profile.controller'
import { FetchSellerProfileUseCase } from '../../domain/forum/application/use-cases/fetch-seller-profile'
import { UploadAttachmentController } from './controllers/upload-attachment.controller'
import { StorageModule } from '../storage/storage.module'
import { UploadAndCreateAttachmentUseCase } from '../../domain/forum/application/use-cases/upload-and-create-attachment'
import { CreateProductUseCase } from '../../domain/forum/application/use-cases/create-product'
import { EditProductController } from './controllers/edit-product.controller'
import { EditProductUseCase } from '../../domain/forum/application/use-cases/edit-product'
import { GetProductByIdUseCase } from '../../domain/forum/application/use-cases/get-product-by-id'
import { GetProductByIdController } from './controllers/get-product-by-id.controller'
import { FetchAllProductsUseCase } from '../../domain/forum/application/use-cases/fetch-all-products'

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateCategoryController,
    CreateProductController,
    FetchAllProductsController,
    FetchSellerProfileController,
    UploadAttachmentController,
    EditProductController,
    GetProductByIdController,
  ],
  providers: [
    FetchSellerProfileUseCase,
    UploadAndCreateAttachmentUseCase,
    CreateProductUseCase,
    EditProductUseCase,
    GetProductByIdUseCase,
    FetchAllProductsUseCase,
  ],
})
export class HttpModule {}
