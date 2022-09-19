import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  CacheKey,
  CacheTTL,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import ParameterID from '../utils/parameterID';
import { ApiTags } from '@nestjs/swagger';
import { HttpCacheInterceptor } from '../utils/httpCache.interceptor';
import { GET_RECIPES_CACHE_KEY } from './constants/recipesCacheKey.constant';
import Recipe from './recipes.entity';

@Controller('recipes')
@ApiTags('recipes')
@UseInterceptors(ClassSerializerInterceptor)
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  create(@Body() createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    return this.recipesService.createRecipe(createRecipeDto);
  }

  @Get('random')
  fetchRandomRecipes() {
    return this.recipesService.fetchRequests();
  }

  @Get()
  @UseInterceptors(HttpCacheInterceptor)
  @CacheKey(GET_RECIPES_CACHE_KEY)
  @CacheTTL(120)
  @Get()
  getAllRecipes(): Promise<Recipe[]> {
    return this.recipesService.getAllRecipes();
  }

  @Get(':id')
  getRecipeById(@Param() { id }: ParameterID): Promise<Recipe> {
    return this.recipesService.getRecipeById(+id);
  }

  @Patch(':id')
  replaceRecipe(
    @Param() { id }: ParameterID,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ): Promise<Recipe> {
    return this.recipesService.updateRecipe(+id, updateRecipeDto);
  }

  @Delete(':id')
  deleteRecipe(@Param() { id }: ParameterID): Promise<void> {
    return this.recipesService.deleteRecipe(Number(id));
  }
}
