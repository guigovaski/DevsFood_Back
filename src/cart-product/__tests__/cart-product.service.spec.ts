import { Test, TestingModule } from '@nestjs/testing';
import { CartProductService } from '../cart-product.service';
import { Repository } from 'typeorm';
import { CartProductEntity } from '../entities/cart-product.entity';
import { ProductService } from '@src/product/product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { productMock } from '@src/product/__mocks__/product.mock';
import { cartMock } from '@src/cart/__mocks__/cart.mock';
import { inserCartMock } from '@src/cart/__mocks__/insert-cart.mock';
import { cartProductMock } from '../__mocks__/product-cart.mock';
import { NotFoundException } from '@nestjs/common';
import { updateCartMock } from '@src/cart/__mocks__/update-cart.mock';

describe('CartProductService', () => {
  let service: CartProductService;
  let productService: ProductService;
  let cartProductRepository: Repository<CartProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ProductService,
          useValue: {
            findProductById: jest.fn().mockResolvedValue(productMock),
          },
        },
        {
          provide: getRepositoryToken(CartProductEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(cartProductMock),
            delete: jest.fn().mockResolvedValue(true),
            save: jest.fn().mockResolvedValue(cartProductMock),
          },
        },
        CartProductService,
      ],
    }).compile();

    service = module.get<CartProductService>(CartProductService);
    productService = module.get<ProductService>(ProductService);
    cartProductRepository = module.get<Repository<CartProductEntity>>(
      getRepositoryToken(CartProductEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(productService).toBeDefined();
    expect(cartProductRepository).toBeDefined();
  });

  it('should return Delete Result after delete product', async () => {
    const deleteResult = await service.deleteProductInCart(
      productMock.id,
      cartMock.id,
    );

    expect(deleteResult).toEqual(true);
  });
  it('should return CartProduct after create', async () => {
    const productInCart = await service.createProductCart(
      inserCartMock.amount,
      inserCartMock.productId,
      cartMock.id,
    );

    expect(productInCart).toEqual(cartProductMock);
  });

  it('should return error in exception create', async () => {
    jest
      .spyOn(cartProductRepository, 'save')
      .mockRejectedValueOnce(new Error());

    expect(
      service.createProductCart(
        inserCartMock.amount,
        inserCartMock.productId,
        cartMock.id,
      ),
    ).rejects.toThrowError();
  });

  it('should return error in exception delete', async () => {
    jest
      .spyOn(cartProductRepository, 'delete')
      .mockRejectedValueOnce(new Error());

    expect(
      service.deleteProductInCart(productMock.id, cartMock.id),
    ).rejects.toThrowError();
  });

  it('should return CartProduct if exist', async () => {
    const productInCart = await service.verifyProductInCart(
      productMock.id,
      cartMock.id,
    );

    expect(productInCart).toEqual(cartProductMock);
  });

  it('should return error if NotFoundException in verifyProductInCart', async () => {
    jest.spyOn(cartProductRepository, 'findOne').mockResolvedValue(undefined);

    expect(
      service.verifyProductInCart(productMock.id, cartMock.id),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should return error in exception verifyProductInCart', async () => {
    jest.spyOn(cartProductRepository, 'findOne').mockRejectedValue(new Error());

    expect(
      service.verifyProductInCart(productMock.id, cartMock.id),
    ).rejects.toThrowError();
  });

  it('should return error in exception insertProductCart', async () => {
    jest
      .spyOn(productService, 'findProductById')
      .mockRejectedValue(new NotFoundException());

    expect(
      service.insertProductInCart(
        cartMock.id,
        inserCartMock.productId,
        inserCartMock.amount,
      ),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should return cart product if not exists cart', async () => {
    const spy = jest.spyOn(cartProductRepository, 'save');

    const cartProduct = await service.insertProductInCart(
      cartMock.id,
      inserCartMock.productId,
      inserCartMock.amount,
    );

    expect(cartProduct).toEqual(cartProductMock);
    expect(spy.mock.calls[0][0]).toEqual({
      ...cartProductMock,
      amount: cartProductMock.amount + inserCartMock.amount,
    });
  });

  it('should increase the quantity of the product in the cart', async () => {
    const spy = jest.spyOn(cartProductRepository, 'save');

    const cartProduct = await service.insertProductInCart(
      cartMock.id,
      inserCartMock.productId,
      inserCartMock.amount,
    );

    expect(spy.mock.calls[0][0]).toEqual({
      ...cartProduct,
      amount: cartProduct.amount + inserCartMock.amount,
    });
  });

  //Update
  it('should return error in exception updateAmountProductInCart', async () => {
    jest
      .spyOn(productService, 'findProductById')
      .mockRejectedValue(new NotFoundException());

    expect(
      service.updateProductAmountInCart(updateCartMock, cartMock),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should return cart product if not exists cart (updateAmountProductInCart)', async () => {
    jest.spyOn(cartProductRepository, 'findOne').mockResolvedValue(undefined);

    expect(
      service.updateProductAmountInCart(updateCartMock, cartMock),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should return the updated product amount (updateAmountProductInCart)', async () => {
    const spy = jest.spyOn(cartProductRepository, 'save');

    const cartProduct = await service.updateProductAmountInCart(
      updateCartMock,
      cartMock,
    );

    expect(cartProduct).toEqual(cartProductMock);
    expect(spy.mock.calls[0][0].amount).toEqual(updateCartMock.amount);
  });
});
