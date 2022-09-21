import {
  CACHE_MANAGER,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockedConfigService } from '../../utils/mocks/config.service';
import { mockedJwtService } from '../../utils/mocks/jwt.service';
import { mockedRecipe } from '../../utils/mocks/recipe.mock';
import { RecipesController } from '../recipes.controller';
import Recipe from '../recipes.entity';
import { RecipesService } from '../recipes.service';
import { mockedCacheService } from '../../utils/mocks/cache.service';
import { HttpService } from '@nestjs/axios';
import { mockedHttpService } from '../../utils/mocks/http.service';

describe('The RecipeController', () => {
  let app: INestApplication;
  let recipeData: Recipe;
  beforeEach(async () => {
    recipeData = {
      ...mockedRecipe,
    };
    const recipesRepository = {
      create: jest.fn().mockResolvedValue(recipeData),
      save: jest.fn().mockReturnValue(Promise.resolve()),
      findOneBy: jest.fn().mockResolvedValue(recipeData),
    };
    const module = await Test.createTestingModule({
      controllers: [RecipesController],
      providers: [
        RecipesService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: HttpService,
          useValue: mockedHttpService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockedCacheService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        {
          provide: getRepositoryToken(Recipe),
          useValue: recipesRepository,
        },
      ],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });
  describe('when creating a recipe', () => {
    describe('and using valid data', () => {
      it('should respond with the data of the recipe', () => {
        const validData = {
          ...recipeData,
        };
        delete validData.id;
        return request(app.getHttpServer())
          .post('/recipes/')
          .send(mockedRecipe)
          .expect(201)
          .expect({
            id: 1,
            title: mockedRecipe.title,
            urlEdamam: mockedRecipe.urlEdamam,
            urlWeb: mockedRecipe.urlWeb,
            imageLink: mockedRecipe.imageLink,
            ecoClass: mockedRecipe.ecoClass,
            cuisineType: mockedRecipe.cuisineType,
            dishType: mockedRecipe.dishType,
            ingredients: mockedRecipe.ingredients,
            calories: mockedRecipe.calories,
            carbon: mockedRecipe.carbon,
            createTime: mockedRecipe.createTime.toISOString(),
            updateTime: mockedRecipe.updateTime.toISOString(),
          });
      });
    });
    describe('and using invalid data', () => {
      it('should throw an error', () => {
        const wrongData = {
          ...recipeData,
        };
        delete wrongData.id;
        delete wrongData.calories;
        return request(app.getHttpServer())
          .post('/recipes')
          .send(wrongData)
          .expect(400);
      });
    });
  });
});
