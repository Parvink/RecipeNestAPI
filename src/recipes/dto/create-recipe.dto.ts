import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  urlEdamam: string;

  @IsString()
  @IsNotEmpty()
  urlWeb: string;

  @IsString()
  @IsNotEmpty()
  imageLink: string;

  @IsString()
  @IsNotEmpty()
  ecoClass: string;

  @IsString()
  @IsNotEmpty()
  cuisineType: string;

  @IsString()
  @IsNotEmpty()
  dishType: string;

  @IsString({ each: true })
  ingredients: string[];

  @IsNumber()
  calories: number;

  @IsNumber()
  carbon: number;
}
