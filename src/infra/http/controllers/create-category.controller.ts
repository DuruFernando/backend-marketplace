import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { PrismaService } from '../../database/prisma/prisma.service'
import { z } from 'zod'

const createCategoryBodySchema = z.object({
  title: z.string(),
})

type CreateCategoryBodySchema = z.infer<typeof createCategoryBodySchema>

@Controller('/categories')
export class CreateCategoryController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createCategoryBodySchema))
  async handle(@Body() body: CreateCategoryBodySchema) {
    const { title } = body

    await this.prisma.category.create({
      data: {
        title,
        slug: this.convertToSlug(title),
      },
    })
  }

  private convertToSlug(input: string): string {
    // Normalize the string to remove accents (diacritics)
    const normalizedString = input
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

    // Convert to lowercase and replace spaces with hyphens
    const slug = normalizedString
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen

    return slug
  }
}
