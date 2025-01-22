export interface ProductParams {
  page: number
  status: 'available' | 'sold' | 'cancelled'
  q: string
}
