import { productMock } from '@src/product/__mocks__/product.mock';
import { InsertCartDTO } from '../dtos/insert-cart.dto';

export const inserCartMock: InsertCartDTO = {
  productId: productMock.id,
  amount: 1,
};
