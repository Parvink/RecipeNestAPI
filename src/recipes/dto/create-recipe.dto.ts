import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRecipeDto {
  @ApiProperty({
    type: String,
    description: 'Required: The title of the recipe',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: String,
    description: 'Required: The edamam URL of the recipe',
  })
  @IsString()
  @IsNotEmpty()
  urlEdamam: string;

  @ApiProperty({
    type: String,
    description: 'Required: The URL of the recipe',
  })
  @IsString()
  @IsNotEmpty()
  urlWeb: string;

  @ApiProperty({
    type: String,
    description: 'Required: The image URL of the recipe',
  })
  @IsString()
  @IsNotEmpty()
  imageLink: string;

  @ApiProperty({
    type: String,
    description: 'Required: The ecoClass of the recipe (A, B, C, D, E)',
  })
  @IsString()
  @IsNotEmpty()
  ecoClass: string;

  @ApiProperty({
    type: String,
    description: 'Required: The cuisine type of the recipe',
  })
  @IsString()
  @IsNotEmpty()
  cuisineType: string;

  @ApiProperty({
    type: String,
    description: 'Required: The type of dish of the recipe',
  })
  @IsString()
  @IsNotEmpty()
  dishType: string;

  @ApiProperty({
    type: String,
    isArray: true,
    description:
      'Required: The list of ingredients (in string format) of the recipe',
  })
  @IsString({ each: true })
  ingredients: string[];

  @ApiProperty({
    type: Number,
    description: 'Required: The calories of the recipe',
  })
  @IsNumber()
  calories: number;

  @ApiProperty({
    type: Number,
    description: 'Required: The estimated carbon impact of the recipe',
  })
  @IsNumber()
  carbon: number;
}
