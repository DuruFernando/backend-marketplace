import { InMemoryAttachmentRepository } from '../../../../../test/repositories/in-memory-attachments-repository'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error'
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment'
import { FakeUploader } from 'test/storage/fake-uploader'

let inMemoryAttachmentsRepository: InMemoryAttachmentRepository
let fakerUploader: FakeUploader

let sut: UploadAndCreateAttachmentUseCase

describe('Upload and create attachments', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentRepository()
    fakerUploader = new FakeUploader()

    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentsRepository,
      fakerUploader,
    )
  })

  it('should be able to upload and create an attachment', async () => {
    const result = await sut.execute({
      fileName: 'profile.jpg',
      fileType: 'image/jpg',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    })
    expect(fakerUploader.uploads).toHaveLength(1)
    expect(fakerUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.jpg',
      }),
    )
  })

  it('should not be able to upload and create an attachment with invalid type', async () => {
    const result = await sut.execute({
      fileName: 'profile.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
  })
})
