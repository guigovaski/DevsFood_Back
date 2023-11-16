import { CategoryMock } from '@src/category/__mocks__/category.mock';
import { ProductEntity } from '../entities/product.entity';

export const productMock: ProductEntity = {
  id: 123,
  name: 'productMock',
  price: 1,
  image: 'http://image.com',
  categoryId: CategoryMock.id,
  createdAt: new Date(),
  updatedAt: new Date(),
};
