import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from '@src/cart/cart.service';
import { Repository } from 'typeorm';
import { CartEntity } from '../entities/cart.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartProductService } from '@src/cart-product/cart-product.service';
import { cartMock } from '../__mocks__/cart.mock';
import { userEntityMock } from '@src/user/__mocks__/user.mock';
import { NotFoundException } from '@nestjs/common';
import { inserCartMock } from '../__mocks__/insert-cart.mock';
import { productMock } from '@src/product/__mocks__/product.mock';
import { updateCartMock } from '../__mocks__/update-cart.mock';

describe('CartService', () => {
  let service: CartService;
  let cartRepository: Repository<CartEntity>;
  let cartProductService: CartProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: CartProductService,
          useValue: {
            deleteProductInCart: jest.fn().mockResolvedValue(true),
            insertProductInCart: jest.fn().mockResolvedValue(undefined),
            updateProductAmountInCart: jest.fn().mockResolvedValue(undefined),
            createProductCart: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: getRepositoryToken(CartEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(cartMock),
            save: jest.fn().mockResolvedValue(cartMock),
          },
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    cartProductService = module.get<CartProductService>(CartProductService);
    cartRepository = module.get<Repository<CartEntity>>(
      getRepositoryToken(CartEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cartProductService).toBeDefined();
    expect(cartRepository).toBeDefined();
  });

  it('should be return a clear cart', async () => {
    const spy = jest.spyOn(cartRepository, 'save');

    const result = await service.clearCart(userEntityMock.id);

    expect(result).toBeTruthy();
    expect(spy.mock.calls[0][0]).toEqual({
      ...cartMock,
      active: false,
    });
  });

  it('should be return error in findOne undefined', async () => {
    jest.spyOn(cartRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.clearCart(userEntityMock.id)).rejects.toThrowError();
  });

  it('should be return cart in sucess (not send relations)', async () => {
    const spy = jest.spyOn(cartRepository, 'findOne');
    const cart = await service.findCartByUserId(userEntityMock.id);

    expect(cart).toEqual(cartMock);
    expect(spy.mock.calls[0][0].relations).toEqual(undefined);
  });

  it('should be return cart in sucess (send relations)', async () => {
    const spy = jest.spyOn(cartRepository, 'findOne');
    const cart = await service.findCartByUserId(userEntityMock.id, true);

    expect(cart).toEqual(cartMock);
    expect(spy.mock.calls[0][0].relations).toEqual({
      cartProduct: {
        product: true,
      },
    });
  });

  it('should be return notFoundException in not found cart', async () => {
    jest.spyOn(cartRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.findCartByUserId(userEntityMock.id)).rejects.toThrowError(
      NotFoundException,
    );
  });

  it('should be return send info in save (createCart)', async () => {
    const spy = jest.spyOn(cartRepository, 'save');

    const cart = await service.createCart(userEntityMock.id);

    expect(cart).toEqual(cartMock);
    expect(spy.mock.calls[0][0]).toEqual({
      active: true,
      userId: userEntityMock.id,
    });
  });

  it('should be return cart in cart not found (insertProductInCart)', async () => {
    jest.spyOn(cartRepository, 'findOne').mockRejectedValue(undefined);
    const spy = jest.spyOn(cartRepository, 'save');

    const spyCartProduct = jest.spyOn(
      cartProductService,
      'insertProductInCart',
    );

    const cart = await service.insertProductInCart(
      inserCartMock,
      userEntityMock.id,
    );

    expect(cart).toEqual(cartMock);
    expect(spy.mock.calls.length).toEqual(1);
    expect(spyCartProduct.mock.calls.length).toEqual(1);
  });

  it('should be return cart in cart not found (insertProductInCart)', async () => {
    const spy = jest.spyOn(cartRepository, 'save');

    const spyCartProduct = jest.spyOn(
      cartProductService,
      'insertProductInCart',
    );

    const cart = await service.insertProductInCart(
      inserCartMock,
      userEntityMock.id,
    );

    expect(cart).toEqual(cartMock);
    expect(spy.mock.calls.length).toEqual(0);
    expect(spyCartProduct.mock.calls.length).toEqual(1);
  });

  it('should be return cart in updateProductInCart', async () => {
    const spyCartProductService = jest.spyOn(
      cartProductService,
      'updateProductAmountInCart',
    );

    const spySave = jest.spyOn(cartRepository, 'save');

    const cart = await service.updateAmountInCart(
      updateCartMock,
      userEntityMock.id,
    );

    expect(cart).toEqual(cartMock);
    expect(spyCartProductService.mock.calls.length).toEqual(1);
    expect(spySave.mock.calls.length).toEqual(0);
  });

  it('should be return true in deleteProductCart', async () => {
    const spy = jest.spyOn(cartProductService, 'deleteProductInCart');

    expect(
      await service.deleteProductInCart(productMock.id, userEntityMock.id),
    ).toBeTruthy();

    expect(spy.mock.calls.length).toEqual(1);
  });

  it('should be return notFoundException in cart not exists', async () => {
    jest.spyOn(cartRepository, 'findOne').mockResolvedValue(undefined);

    const spy = jest.spyOn(cartProductService, 'deleteProductInCart');

    expect(
      service.deleteProductInCart(productMock.id, userEntityMock.id),
    ).rejects.toThrowError(NotFoundException);

    expect(spy.mock.calls.length).toEqual(0);
  });

  it('should be return cart in createCart in updateAmountInCart', async () => {
    jest.spyOn(cartRepository, 'findOne').mockResolvedValue(undefined);

    const spySave = jest.spyOn(cartRepository, 'save');
    const cart = await service.updateAmountInCart(
      updateCartMock,
      userEntityMock.id,
    );

    expect(cart).toEqual(cartMock);
    expect(spySave.mock.calls.length).toEqual(1);
  });
});
