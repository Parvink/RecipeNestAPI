import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export default class CreateAuthenticationDto {
  @ApiProperty({
    type: String,
    description: 'Required: The email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: 'Required: The name of the user',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    description: 'Required: The password of the user',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string;
}
