import { AppModule } from '../../app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { SellerFactory } from '../../../../test/factories/make-seller'
import { CategoryFactory } from '../../../../test/factories/make-category'
import { ProductFactory } from '../../../../test/factories/make-product'
import { AttachmentFactory } from '../../../../test/factories/make-attachment'
import { ProductAttachmentFactory } from '../../../../test/factories/make-product-attachment'
import { DatabaseModule } from '../../../../src/infra/database/database.module'
import { Slug } from '../../../../src/domain/forum/enterprise/entities/value-objects/slug'

describe('fetch-all-products.controller (E2E)', () => {
  let app: INestApplication
  let sellerFactory: SellerFactory
  let categoryFactory: CategoryFactory
  let productFactory: ProductFactory
  let attachmentFactory: AttachmentFactory
  let productAttachmentFactory: ProductAttachmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        SellerFactory,
        CategoryFactory,
        ProductFactory,
        AttachmentFactory,
        ProductAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    sellerFactory = moduleRef.get(SellerFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    productFactory = moduleRef.get(ProductFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    productAttachmentFactory = moduleRef.get(ProductAttachmentFactory)

    await app.init()
  })

  test('[GET] /products', async () => {
    const user = await sellerFactory.makePrismaSeller({
      name: 'John Doe',
    })

    const category = await categoryFactory.makePrismaCategory({
      title: 'Móvel',
      slug: Slug.create('movel'),
    })

    const product1 = await productFactory.makePrismaProduct({
      ownerId: user.id,
      title: 'Product 01',
      categoryId: category.id,
    })

    const attachment1 = await attachmentFactory.makePrismaAttachment({
      title: 'some title',
    })

    await productAttachmentFactory.makePrismaProductAttachment({
      attachmentId: attachment1.id,
      productId: product1.id,
    })

    const product2 = await productFactory.makePrismaProduct({
      ownerId: user.id,
      title: 'Product 02',
      categoryId: category.id,
    })

    const attachment2 = await attachmentFactory.makePrismaAttachment({
      title: 'some title',
    })

    await productAttachmentFactory.makePrismaProductAttachment({
      attachmentId: attachment2.id,
      productId: product2.id,
    })

    const response = await request(app.getHttpServer()).get('/products')

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      products: [
        expect.objectContaining({ title: 'Product 02' }),
        expect.objectContaining({ title: 'Product 01' }),
      ],
    })
  })
})
