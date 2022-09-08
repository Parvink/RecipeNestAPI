import { TransformRecipeDto } from './transform-recipe.dto';

export class ResponseRecipe {
  recipe: TransformRecipeDto;
  _links: Record<string, unknown>;
}
