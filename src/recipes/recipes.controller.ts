import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import ParameterID from '../utils/parameterID';

@Controller('recipes')
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
