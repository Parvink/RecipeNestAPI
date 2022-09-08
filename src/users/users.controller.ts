import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import CreateAuthenticationDto from '../authentication/dto/register.dto';
import UpdateUserDto from './dto/update-user.dto';
import ParameterID from '../utils/parameterID';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateAuthenticationDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  findOne(@Param() { id }: ParameterID) {
    return this.usersService.getUserById(+id);
  }

  @Patch(':id')
  update(@Param() { id }: ParameterID, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param() { id }: ParameterID) {
    return this.usersService.deleteUser(+id);
  }
}
