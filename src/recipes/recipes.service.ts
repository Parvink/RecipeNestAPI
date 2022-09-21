import { HttpService } from '@nestjs/axios';
import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { map } from 'rxjs';
import { constructUrl } from '../utils/urlConstructor';
import { FindManyOptions, MoreThan, Repository } from 'typeorm';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { ResponseRecipe } from './dto/response-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import RecipeNotFoundException from './exceptions/recipeNotFound.exception';
import Recipe from './recipes.entity';
import { Cache } from 'cache-manager';
import { GET_RECIPES_CACHE_KEY } from './constants/recipesCacheKey.constant';
import PostgresErrorCode from '../database/postgresErrorCodes.enum';
import { PaginationRecipesOutput } from '../utils/paginationRecipesOutput';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    private readonly configService: ConfigService,
    private httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async clearCache(): Promise<void> {
    const keys: string[] = await this.cacheManager.store.keys();
    keys.forEach((key) => {
      if (key.startsWith(GET_RECIPES_CACHE_KEY)) {
        this.cacheManager.del(key);
      }
    });
  }

  async createRecipe(recipeDto: CreateRecipeDto) {
    try {
      const newRecipe = await this.recipeRepository.create(recipeDto);
      await this.recipeRepository.save(newRecipe);
      await this.clearCache();
      return newRecipe;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'A recipe with that url already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new InternalServerErrorException();
    }
  }

  fetchRequests() {
    const url = constructUrl(
      this.configService.get('EDAM_APP_ID'),
      this.configService.get('EDAM_KEY'),
    );

    return this.httpService.get(url).pipe(
      map((response) => response.data),
      map((data) => ({
        results: data.hits.map((recipe: ResponseRecipe) => {
          return new Recipe(recipe.recipe);
        }),
      })),
    );
  }

  async getAllRecipes(
    offset?: number,
    limit?: number,
    startId?: number,
  ): Promise<PaginationRecipesOutput> {
    const where: FindManyOptions<Recipe>['where'] = {};
    let separateCount = 0;
    if (startId) {
      where.id = MoreThan(startId);
      separateCount = await this.recipeRepository.count();
    }
    const [recipes, count] = await this.recipeRepository.findAndCount({
      where,
      order: {
        id: 'ASC',
      },
      skip: offset,
      take: limit,
    });

    return {
      recipes,
      count: startId ? separateCount : count,
    };
  }

  async getRecipeById(id: number): Promise<Recipe> {
    const recipe = await this.recipeRepository.findOneBy({ id });
    if (recipe) return recipe;
    throw new RecipeNotFoundException(id);
  }

  async updateRecipe(id: number, recipe: UpdateRecipeDto): Promise<Recipe> {
    await this.recipeRepository.update(id, recipe);
    const updatedRecipe = await this.recipeRepository.findOneBy({ id });
    if (updatedRecipe) {
      await this.clearCache();
      return updatedRecipe;
    }
    throw new RecipeNotFoundException(id);
  }

  async deleteRecipe(id: number): Promise<void> {
    const deleteResponse = await this.recipeRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new RecipeNotFoundException(id);
    }
    await this.clearCache();
  }
}
