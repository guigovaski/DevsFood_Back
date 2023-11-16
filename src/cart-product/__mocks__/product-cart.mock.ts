import { cartMock } from '@src/cart/__mocks__/cart.mock';
import { productMock } from '@src/product/__mocks__/product.mock';

export const cartProductMock = {
  id: 123,
  amount: 321,
  productId: productMock.id,
  cartId: cartMock.id,
  createdAt: new Date(),
  updatedAt: new Date(),
};
