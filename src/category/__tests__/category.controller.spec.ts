import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from '../category.controller';
import { CategoryService } from '../category.service';
import { CategoryMock } from '../__mocks__/category.mock';
import { createCategoryMock } from '../__mocks__/create-category.mock';

describe('CategoryController', () => {
  let controller: CategoryController;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CategoryService,
          useValue: {
            findAllCategories: jest.fn().mockResolvedValue([CategoryMock]),
            createCategory: jest.fn().mockResolvedValue(CategoryMock),
          },
        },
      ],
      controllers: [CategoryController],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(categoryService).toBeDefined();
  });

  it('should category Entity in findAllCategories', async () => {
    const category = await controller.findAllCategories();

    expect(category).toEqual([
      {
        id: CategoryMock.id,
        name: CategoryMock.name,
      },
    ]);
  });

  it('should return category Entity in createCategory', async () => {
    const category = await controller.createCategory(createCategoryMock);

    expect(category).toEqual(CategoryMock);
  });
});
