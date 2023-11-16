import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { ProductEntity } from '../entities/product.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { productMock } from '../__mocks__/product.mock';
import { CategoryService } from '@src/category/category.service';
import { CategoryMock } from '@src/category/__mocks__/category.mock';
import { createProductMock } from '../__mocks__/createProduct.mock';
import { updateProductMock } from '../__mocks__/updateProduct.mock';
import { BadRequestException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: Repository<ProductEntity>;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([productMock]),
            findOne: jest.fn().mockResolvedValue(productMock),
            save: jest.fn().mockResolvedValue(productMock),
            delete: jest.fn().mockResolvedValue(undefined),
            update: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: CategoryService,
          useValue: {
            findCategoryById: jest.fn().mockResolvedValue(CategoryMock),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    categoryService = module.get<CategoryService>(CategoryService);
    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(categoryService).toBeDefined();
    expect(productRepository).toBeDefined();
  });

  it('should return all products', async () => {
    const products = await service.findAllProducts();

    expect(products).toEqual([productMock]);
  });

  it('should return error if products empty', async () => {
    jest.spyOn(productRepository, 'find').mockResolvedValue([]);

    expect(service.findAllProducts()).rejects.toThrowError();
  });

  it('should return error in exception', async () => {
    jest.spyOn(productRepository, 'find').mockRejectedValue(new Error());

    expect(service.findAllProducts()).rejects.toThrowError();
  });

  it('should return product after insert in DB', async () => {
    const product = await service.createProduct(createProductMock);

    expect(product).toEqual(productMock);
  });

  it('should return product after insert in DB', async () => {
    jest
      .spyOn(categoryService, 'findCategoryById')
      .mockRejectedValue(new Error());

    expect(service.createProduct(createProductMock)).rejects.toThrowError();
  });

  it('should return product in findById', async () => {
    const product = await service.findProductById(productMock.id);

    expect(product).toEqual(productMock);
  });

  it('should return error in product not found', async () => {
    jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.findProductById(productMock.id)).rejects.toThrowError();
  });

  it('should define deleteProduct method', async () => {
    const deleteProduct = await service.deleteProduct(productMock.id);

    expect(deleteProduct).toBeUndefined();
  });

  it('should return product after update', async () => {
    jest.spyOn(productRepository, 'update').mockResolvedValue(undefined);

    await service.updateProduct(productMock.id, updateProductMock);

    expect(productRepository.update).toBeCalledWith(
      productMock.id,
      updateProductMock,
    );
  });

  it('should throw error if product not found in updateProduct', async () => {
    // Espiona a função de update do repositório e define o retorno como um erro
    jest.spyOn(productRepository, 'update').mockRejectedValue(new Error());

    // Chama o serviço para atualizar o produto com um ID indefinido (simulando produto não encontrado)
    await expect(
      service.updateProduct(undefined, updateProductMock),
    ).rejects.toThrowError();
  });

  it('should throw error if no body is sent in the request', async () => {
    jest.spyOn(productRepository, 'update').mockResolvedValue(undefined);

    await expect(
      service.updateProduct(productMock.id, undefined),
    ).rejects.toThrowError();
  });
});
