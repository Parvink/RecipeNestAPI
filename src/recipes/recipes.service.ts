import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { map } from 'rxjs';
import { constructUrl } from '../utils/urlConstructor';
import { Repository } from 'typeorm';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { ResponseRecipe } from './dto/response-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import RecipeNotFoundException from './exceptions/recipeNotFound.exception';
import Recipe from './recipes.entity';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    private readonly configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async createRecipe(recipeDto: CreateRecipeDto) {
    const newRecipe = await this.recipeRepository.create(recipeDto);
    await this.recipeRepository.save(newRecipe);
    return newRecipe;
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

  getAllRecipes(): Promise<Recipe[]> {
    return this.recipeRepository.find();
  }

  async getRecipeById(id: number): Promise<Recipe> {
    const recipe = await this.recipeRepository.findOneBy({ id });
    if (recipe) return recipe;
    throw new RecipeNotFoundException(id);
  }

  async updateRecipe(id: number, recipe: UpdateRecipeDto): Promise<Recipe> {
    await this.recipeRepository.update(id, recipe);
    const updatedPost = await this.recipeRepository.findOneBy({ id });
    if (updatedPost) return updatedPost;
    throw new RecipeNotFoundException(id);
  }

  async deleteRecipe(id: number) {
    const deleteResponse = await this.recipeRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new RecipeNotFoundException(id);
    }
  }
}
