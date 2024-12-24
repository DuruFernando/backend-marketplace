import {
  Body,
  Controller,
  HttpCode,
  Post,
  ConflictException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'

const createAccountBodySchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string().email(),
  password: z.string(),
  passwordConfirmation: z.string(),
})

const bodyValidationBody = new ZodValidationPipe(createAccountBodySchema)
type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationBody) body: CreateAccountBodySchema) {
    const { name, phone, email, password, passwordConfirmation } = body

    if (passwordConfirmation !== password) {
      throw new ConflictException('password does not match')
    }

    const userWithSameWmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameWmail) {
      throw new ConflictException(
        'user with same e-mail address already exists',
      )
    }

    const hashedPassword = await hash(password, 8)

    await this.prisma.user.create({
      data: {
        name,
        phone,
        email,
        password: hashedPassword,
      },
    })
  }
}
