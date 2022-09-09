import { NotFoundException } from '@nestjs/common';

class RecipeNotFoundException extends NotFoundException {
  constructor(recipeId: number) {
    super(`Recipe with id ${recipeId} not found`);
  }
}

export default RecipeNotFoundException;
