import { AppModule } from '../../app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { PrismaService } from '../../database/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { AttachmentFactory } from '../../../../test/factories/make-attachment'
import { DatabaseModule } from '../../../infra/database/database.module'

describe('create-product.controller (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let attachmentFactory: AttachmentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    attachmentFactory = moduleRef.get(AttachmentFactory)

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /products', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Fernando Duru',
        phone: '11975775215',
        email: 'fernandoduru@gmail.com',
        password: '123456',
      },
    })
    const accessToken = jwt.sign({ sub: user.id })

    const category = await prisma.category.create({
      data: {
        title: 'Móvel',
        slug: 'movel',
      },
    })
    const categoryId = category.id

    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()

    const response = await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Mesa',
        description: 'Mesa 120cm redonda com 4 cadeiras',
        priceInCents: 159999,
        categoryId,
        attachments: [attachment1.id.toString(), attachment2.id.toString()],
      })

    expect(response.statusCode).toBe(201)

    const productOnDatabase = await prisma.product.findFirst({
      where: {
        title: 'Mesa',
      },
    })

    expect(productOnDatabase).toBeTruthy()

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        productId: productOnDatabase?.id,
      },
    })

    expect(attachmentsOnDatabase).toHaveLength(2)
  })
})
