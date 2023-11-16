import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from '../cart.controller';
import { CartService } from '../cart.service';
import { inserCartMock } from '../__mocks__/insert-cart.mock';
import { userEntityMock } from '@src/user/__mocks__/user.mock';
import { cartMock } from '../__mocks__/cart.mock';
import { updateCartMock } from '../__mocks__/update-cart.mock';

describe('CartController', () => {
  let controller: CartController;
  let cartService: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CartService,
          useValue: {
            insertProductInCart: jest.fn().mockResolvedValue(cartMock),
            findCartByUserId: jest.fn().mockResolvedValue(cartMock),
            updateAmountInCart: jest.fn().mockResolvedValue(cartMock),
            clearCart: jest.fn().mockResolvedValue(true),
          },
        },
      ],
      controllers: [CartController],
    }).compile();

    controller = module.get<CartController>(CartController);
    cartService = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(cartService).toBeDefined();
  });

  it('should be return cart in create', async () => {
    const cart = await controller.createCart(inserCartMock, userEntityMock.id);

    expect(cart).toEqual({
      id: cartMock.id,
    });
  });

  it('should be return cart in findCartByUserId', async () => {
    const cart = await controller.findCartByUserId(userEntityMock.id);

    expect(cart).toEqual({
      id: cartMock.id,
    });
  });

  it('should be return true in deleteCart', async () => {
    const cart = await controller.clearCart(userEntityMock.id);

    expect(cart).toBeTruthy();
  });

  it('should be return updateCart', async () => {
    const cart = await controller.updateProductInCart(
      userEntityMock.id,
      updateCartMock,
    );

    expect(cart).toEqual({
      id: cartMock.id,
    });
  });
});
