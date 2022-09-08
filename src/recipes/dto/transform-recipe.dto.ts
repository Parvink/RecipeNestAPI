import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TransformRecipeDto {
  @IsString()
  @IsNotEmpty()
  uri: string;

  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString({ each: true })
  ingredientLines: string[];

  @IsNumber()
  calories: number;

  @IsNumber()
  totalCO2Emissions: number;

  @IsString()
  @IsNotEmpty()
  co2EmissionsClass: string;

  @IsString({ each: true })
  cuisineType: string[];

  @IsString({ each: true })
  dishType: string[];
}
