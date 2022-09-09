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
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import ParameterID from '../utils/parameterID';
import { ApiTags } from '@nestjs/swagger';
import { HttpCacheInterceptor } from '../utils/httpCache.interceptor';
import { GET_RECIPES_CACHE_KEY } from './constants/recipesCacheKey.constant';

@Controller('recipes')
@ApiTags('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  create(@Body() createRecipeDto: CreateRecipeDto) {
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
  getAllRecipes() {
    return this.recipesService.getAllRecipes();
  }

  @Get(':id')
  getRecipeById(@Param() { id }: ParameterID) {
    return this.recipesService.getRecipeById(+id);
  }

  @Patch(':id')
  replaceRecipe(
    @Param() { id }: ParameterID,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    return this.recipesService.updateRecipe(+id, updateRecipeDto);
  }

  @Delete(':id')
  deleteRecipe(@Param() { id }: ParameterID) {
    return this.recipesService.deleteRecipe(Number(id));
  }
}
