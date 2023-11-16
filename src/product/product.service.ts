import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductEntity } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from '@src/category/category.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoryService,
  ) {}

  async findAllProducts(): Promise<ProductEntity[]> {
    const products = await this.productRepository.find();

    if (!products || products.length === 0) {
      throw new NotFoundException('Not found products');
    }

    return products;
  }

  async createProduct(product: CreateProductDto): Promise<ProductEntity> {
    await this.categoryService.findCategoryById(product.categoryId);

    return this.productRepository.save(product);
  }

  async findProductById(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async deleteProduct(id: number): Promise<void> {
    await this.findProductById(id);

    await this.productRepository.delete(id);
  }

  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<void> {
    await this.findProductById(id);

    if (!updateProductDto || Object.keys(updateProductDto).length === 0) {
      throw new BadRequestException(
        'O corpo da requisição não contém dados para atualização.',
      );
    }

    await this.productRepository.update(id, updateProductDto);
  }
}
