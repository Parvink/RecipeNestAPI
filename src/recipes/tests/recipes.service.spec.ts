import { Test, TestingModule } from '@nestjs/testing';
import { RecipesService } from '../recipes.service';
import { CreateRecipeDto } from '../dto/create-recipe.dto';
import { RecipesController } from '../recipes.controller';
import { UpdateRecipeDto } from '../dto/update-recipe.dto';
import { CACHE_MANAGER } from '@nestjs/common';
import { mockedCacheService } from '../../utils/mocks/cache.service';

describe('Recipe Service', () => {
  let recipeService: RecipesService;

  beforeAll(async () => {
    const ApiServiceProvider = {
      provide: RecipesService,
      useFactory: () => ({
        createRecipe: jest.fn(),
        getAllRecipes: jest.fn(() => []),
        getRecipeById: jest.fn(),
        updateRecipe: jest.fn(),
        deleteRecipe: jest.fn(),
        clearCache: jest.fn(),
        fetchRequest: jest.fn(() => []),
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipesController],
      providers: [
        RecipesService,
        ApiServiceProvider,
        {
          provide: CACHE_MANAGER,
          useValue: mockedCacheService,
        },
      ],
    }).compile();
    recipeService = module.get<RecipesService>(RecipesService);
  });

  it('should call createRecipe method with expected params', async () => {
    const createRecipeSpy = jest.spyOn(recipeService, 'createRecipe');
    const dto = new CreateRecipeDto();
    recipeService.createRecipe(dto);
    expect(createRecipeSpy).toHaveBeenCalledWith(dto);
  });

  it('should call getRecipeById method with expected param', async () => {
    const getRecipeByIdSpy = jest.spyOn(recipeService, 'getRecipeById');
    const id = 10;
    recipeService.getRecipeById(id);
    expect(getRecipeByIdSpy).toHaveBeenCalledWith(id);
  });

  it('should call updateRecipe method with expected params', async () => {
    const updateRecipeSpy = jest.spyOn(recipeService, 'updateRecipe');
    const recipeId = 3;
    const dto = new UpdateRecipeDto();
    recipeService.updateRecipe(recipeId, dto);
    expect(updateRecipeSpy).toHaveBeenCalledWith(recipeId, dto);
  });

  it('should call deleteRecipe method with expected param', async () => {
    const deleteRecipeSpy = jest.spyOn(recipeService, 'deleteRecipe');
    const recipeId = 2;
    recipeService.deleteRecipe(recipeId);
    expect(deleteRecipeSpy).toHaveBeenCalledWith(recipeId);
  });
});
