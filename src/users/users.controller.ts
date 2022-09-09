import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  CacheTTL,
  CacheKey,
} from '@nestjs/common';
import { UsersService } from './users.service';
import CreateAuthenticationDto from '../authentication/dto/register.dto';
import UpdateUserDto from './dto/update-user.dto';
import ParameterID from '../utils/parameterID';
import { ApiTags } from '@nestjs/swagger';
import { GET_USERS_CACHE_KEY } from './constants/usersCacheKey.constant';
import { HttpCacheInterceptor } from '../utils/httpCache.interceptor';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateAuthenticationDto) {
    return this.usersService.create(createUserDto);
  }

  @UseInterceptors(HttpCacheInterceptor)
  @CacheKey(GET_USERS_CACHE_KEY)
  @CacheTTL(120)
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
