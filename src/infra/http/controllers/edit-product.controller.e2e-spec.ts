import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from '../../../../src/infra/app.module'
import { PrismaService } from '../../../../src/infra/database/prisma/prisma.service'
import { AttachmentFactory } from '../../../../test/factories/make-attachment'
import { ProductFactory } from '../../../../test/factories/make-product'
import { ProductAttachmentFactory } from '../../../../test/factories/make-product-attachment'
import { SellerFactory } from '../../../../test/factories/make-seller'
import { CategoryFactory } from '../../../../test/factories/make-category'
import request from 'supertest'
import { DatabaseModule } from '../../../../src/infra/database/database.module'

describe('Edit product (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let productFactory: ProductFactory
  let attachmentFactory: AttachmentFactory
  let productAttachmentFactory: ProductAttachmentFactory
  let sellerFactory: SellerFactory
  let categoryFactory: CategoryFactory
  let jwt: JwtService

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
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /products/:id', async () => {
    const user = await sellerFactory.makePrismaSeller()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const category = await categoryFactory.makePrismaCategory()

    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()

    const product = await productFactory.makePrismaProduct({
      ownerId: user.id,
      categoryId: category.id,
    })

    await productAttachmentFactory.makePrismaProductAttachment({
      attachmentId: attachment1.id,
      productId: product.id,
    })

    await productAttachmentFactory.makePrismaProductAttachment({
      attachmentId: attachment2.id,
      productId: product.id,
    })

    const attachment3 = await attachmentFactory.makePrismaAttachment()

    const productId = product.id.toString()
    console.log(productId)

    const response = await request(app.getHttpServer())
      .put(`/products/${productId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Mesa de centro',
        description: 'Mesa para sala',
        priceInCents: 24999,
        categoryId: category.id.toString(),
        attachments: [attachment1.id.toString(), attachment3.id.toString()],
      })

    expect(response.statusCode).toBe(204)

    const productOnDatabase = await prisma.product.findFirst({
      where: {
        title: 'Mesa de centro',
      },
    })

    expect(productOnDatabase).toBeTruthy()

    const attchmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        productId: productOnDatabase?.id,
      },
    })

    expect(attchmentsOnDatabase).toHaveLength(2)
    expect(attchmentsOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: attachment1.id.toString(),
        }),
        expect.objectContaining({
          id: attachment3.id.toString(),
        }),
      ]),
    )
  })
})
