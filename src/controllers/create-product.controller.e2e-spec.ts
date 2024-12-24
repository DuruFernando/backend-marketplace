import { AppModule } from 'src/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { PrismaService } from '../prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'

describe('create-product.controller (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
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

    const response = await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Mesa',
        description: 'Mesa 120cm redonda com 4 cadeiras',
        categoryId,
        priceInCents: 159999,
      })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.product.findFirst({
      where: {
        title: 'Mesa',
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
