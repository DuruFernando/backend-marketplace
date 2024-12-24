import { AppModule } from 'src/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { PrismaService } from '../prisma/prisma.service'
import { hash } from 'bcryptjs'

describe('authenticate.controller (E2E)', () => {
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

  test('[POST] /sessions', async () => {
    await prisma.user.create({
      data: {
        name: 'Fernando Duru',
        phone: '11975775215',
        email: 'fernandoduru@gmail.com',
        password: await hash('123456', 8),
      },
    })
    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'fernandoduru@gmail.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
