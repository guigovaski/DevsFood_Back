import { productMock } from '@src/product/__mocks__/product.mock';
import { UpdateCartDto } from '../dtos/update-cart.dto';

export const updateCartMock: UpdateCartDto = {
  amount: 324324,
  productId: productMock.id,
};
