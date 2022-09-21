import Recipe from '../recipes/recipes.entity';

export class PaginationRecipesOutput {
  recipes: Recipe[];
  count: number;
}
