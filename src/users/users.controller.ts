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
  ClassSerializerInterceptor,
  Query,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import CreateAuthenticationDto from '../authentication/dto/register.dto';
import UpdateUserDto from './dto/update-user.dto';
import ParameterID from '../utils/parameterID';
import { ApiTags } from '@nestjs/swagger';
import { GET_USERS_CACHE_KEY } from './constants/usersCacheKey.constant';
import { HttpCacheInterceptor } from '../utils/httpCache.interceptor';
import { PaginationParams } from '../utils/paginationParams';
import { RecipesService } from '../recipes/recipes.service';
import RecipeNotFoundException from '../recipes/exceptions/recipeNotFound.exception';
import JwtAuthenticationGuard from '../authentication/guards/jwtAuthentication.guard';
import RequestWithUser from '../authentication/interfaces/requestUser.interface';

@Controller('users')
@ApiTags('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly recipesService: RecipesService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateAuthenticationDto) {
    return this.usersService.create(createUserDto);
  }

  @UseInterceptors(HttpCacheInterceptor)
  @CacheKey(GET_USERS_CACHE_KEY)
  @CacheTTL(120)
  @Get()
  findAll(
    @Query('search') search: string,
    @Query() { offset, limit, startId }: PaginationParams,
  ) {
    return this.usersService.getAllUsers(offset, limit, startId);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Put('recipe/:id')
  async saveRecipe(
    @Req() request: RequestWithUser,
    @Param() { id }: ParameterID,
  ) {
    const recipe = await this.recipesService.getRecipeById(+id);
    if (!recipe) {
      throw new RecipeNotFoundException(+id);
    }
    return this.usersService.saveRecipe(request.user.id, recipe);
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
