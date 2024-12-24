import { AppModule } from '../../app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { PrismaService } from '../../database/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'

describe('fetch-all-products.controller (E2E)', () => {
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

  test('[GET] /products', async () => {
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

    await prisma.product.createMany({
      data: [
        {
          title: 'Mesa 1',
          description: 'Mesa 120cm redonda com 4 cadeiras',
          categoryId,
          priceInCents: 159999,
          ownerId: user.id,
        },
        {
          title: 'Mesa 2',
          description: 'Mesa 180cm redonda com 6 cadeiras',
          categoryId,
          priceInCents: 239999,
          ownerId: user.id,
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/products')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      products: [
        expect.objectContaining({ title: 'Mesa 1' }),
        expect.objectContaining({ title: 'Mesa 2' }),
      ],
    })
  })
})
