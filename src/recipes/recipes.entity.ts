import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TransformRecipeDto } from './dto/transform-recipe.dto';

@Entity()
class Recipe {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column({ unique: true })
  public urlEdamam: string;

  @Column()
  public urlWeb: string;

  @Column()
  public imageLink: string;

  @Column()
  public ecoClass: string;

  @Column()
  public cuisineType: string;

  @Column()
  public dishType: string;

  @Column('text', { array: true })
  public ingredients: string[];

  @Column()
  public calories: number;

  @Column()
  public carbon: number;

  //TODO: Find a more elegant solution
  constructor(responseRecipe?: TransformRecipeDto) {
    if (responseRecipe) {
      this.carbon = Math.trunc(responseRecipe.totalCO2Emissions);
      this.calories = Math.trunc(responseRecipe.calories);
      this.urlEdamam = responseRecipe.uri;
      this.urlWeb = responseRecipe.url;
      this.ingredients = responseRecipe.ingredientLines;
      this.ecoClass = responseRecipe.co2EmissionsClass;
      this.title = responseRecipe.label;
      this.imageLink = responseRecipe.image;
      this.cuisineType = responseRecipe.cuisineType[0]
        ? responseRecipe.cuisineType[0]
        : '';
      this.dishType = responseRecipe.dishType[0]
        ? responseRecipe.dishType[0]
        : '';
    }
  }
}

export default Recipe;
