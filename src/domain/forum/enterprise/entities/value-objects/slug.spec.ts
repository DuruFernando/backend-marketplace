import { Slug } from './slug'

test('it should be able to create a new slug from text', () => {
  const slug = Slug.createFromText('Example category title')

  expect(slug.value).toBe('example-category-title')
})
