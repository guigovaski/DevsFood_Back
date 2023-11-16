import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartProductEntity } from './entities/cart-product.entity';
import { Repository } from 'typeorm';
import { ProductService } from '@src/product/product.service';
import { CartEntity } from '@src/cart/entities/cart.entity';
import { UpdateCartDto } from '@src/cart/dtos/update-cart.dto';

@Injectable()
export class CartProductService {
  constructor(
    @InjectRepository(CartProductEntity)
    private readonly cartProductRepository: Repository<CartProductEntity>,
    private readonly productService: ProductService,
  ) {}

  async verifyProductInCart(
    productId: number,
    cartId: number,
  ): Promise<CartProductEntity> {
    const cartProduct = await this.cartProductRepository.findOne({
      where: {
        productId,
        cartId,
      },
    });

    if (!cartProduct) {
      throw new NotFoundException('Product not found in cart');
    }

    return cartProduct;
  }

  async createProductCart(
    cartId: number,
    productId: number,
    amount: number,
  ): Promise<CartProductEntity> {
    return this.cartProductRepository.save({
      cartId,
      productId,
      amount,
    });
  }

  async insertProductInCart(
    cartId: number,
    productId: number,
    amount: number,
  ): Promise<CartProductEntity> {
    await this.productService.findProductById(productId);

    const cartProduct = await this.verifyProductInCart(cartId, productId).catch(
      async () => {
        return this.createProductCart(cartId, productId, 0);
      },
    );

    return this.cartProductRepository.save({
      ...cartProduct,
      amount: cartProduct.amount + amount,
    });
  }

  async deleteProductInCart(
    productId: number,
    cartId: number,
  ): Promise<boolean> {
    await this.cartProductRepository.delete({ productId, cartId }).catch(() => {
      throw new NotFoundException('Product not found in cart');
    });

    return true;
  }

  async updateProductAmountInCart(
    updateCartDTO: UpdateCartDto,
    cart: CartEntity,
  ): Promise<CartProductEntity> {
    await this.productService.findProductById(updateCartDTO.productId);

    const cartProduct = await this.verifyProductInCart(
      updateCartDTO.productId,
      cart.id,
    );

    return this.cartProductRepository.save({
      ...cartProduct,
      amount: updateCartDTO.amount,
    });
  }
}
