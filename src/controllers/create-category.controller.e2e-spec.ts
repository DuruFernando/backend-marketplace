import { AppModule } from 'src/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { PrismaService } from '../prisma/prisma.service'

describe('create-category.controller (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /categories', async () => {
    const response = await request(app.getHttpServer())
      .post('/categories')
      .send({
        title: 'Imóvel',
      })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.category.findUnique({
      where: {
        slug: 'imovel',
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
