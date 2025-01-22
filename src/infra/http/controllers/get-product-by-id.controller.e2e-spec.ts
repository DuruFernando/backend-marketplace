import { INestApplication } from '@nestjs/common'
// import { JwtService } from '@nestjs/jwt'
import { AttachmentFactory } from '../../../../test/factories/make-attachment'
import { ProductFactory } from '../../../../test/factories/make-product'
import { ProductAttachmentFactory } from '../../../../test/factories/make-product-attachment'
import { SellerFactory } from '../../../../test/factories/make-seller'
import { AppModule } from '../../../../src/infra/app.module'
import { DatabaseModule } from '../../../../src/infra/database/database.module'
import { Test } from '@nestjs/testing'
import { CategoryFactory } from '../../../../test/factories/make-category'
import { Slug } from '../../../../src/domain/forum/enterprise/entities/value-objects/slug'
import request from 'supertest'

describe('Get product by id (E2E)', () => {
  let app: INestApplication
  let sellerFactory: SellerFactory
  let categoryFactory: CategoryFactory
  let productFactory: ProductFactory
  let attachmentFactory: AttachmentFactory
  let productAttachmentFactory: ProductAttachmentFactory
  //   let jwt: JwtService

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
    // jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /products/:id', async () => {
    const user = await sellerFactory.makePrismaSeller({
      name: 'John Doe',
    })

    const category = await categoryFactory.makePrismaCategory({
      title: 'Móvel',
      slug: Slug.create('movel'),
    })

    // const accessToken = jwt.sign({ sub: user.id.toString() })

    const product = await productFactory.makePrismaProduct({
      ownerId: user.id,
      title: 'Product 01',
      categoryId: category.id,
    })

    const attachment = await attachmentFactory.makePrismaAttachment({
      title: 'some title',
    })

    await productAttachmentFactory.makePrismaProductAttachment({
      attachmentId: attachment.id,
      productId: product.id,
    })

    const productId = product.id.toString()

    const response = await request(app.getHttpServer())
      .get(`/products/${productId}`)
      .send()

    console.log('response', response.body)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      product: expect.objectContaining({
        product: expect.objectContaining({ title: 'Product 01' }),
        category: expect.objectContaining({ title: 'Móvel' }),
        owner: expect.objectContaining({ name: 'John Doe' }),
        attachments: expect.arrayContaining([
          expect.objectContaining({
            title: 'some title',
          }),
        ]),
      }),
    })
  })
})
