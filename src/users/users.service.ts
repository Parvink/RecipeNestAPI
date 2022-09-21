import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, FindManyOptions, MoreThan, Repository } from 'typeorm';
import User from './user.entity';
import { Cache } from 'cache-manager';
import UpdateUserDto from './dto/update-user.dto';
import CreateAuthenticationDto from '../authentication/dto/register.dto';
import UserNotFoundException from './exceptions/userNotFound.exception';
import { GET_USERS_CACHE_KEY } from './constants/usersCacheKey.constant';
import { PaginationOutput } from '../utils/paginationOutput';
import Recipe from '../recipes/recipes.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async clearCache() {
    const keys: string[] = await this.cacheManager.store.keys();
    keys.forEach((key) => {
      if (key.startsWith(GET_USERS_CACHE_KEY)) {
        this.cacheManager.del(key);
      }
    });
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email: email });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async create(userData: CreateAuthenticationDto) {
    const newUser = this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    await this.clearCache();
    return newUser;
  }

  async getAllUsers(
    offset?: number,
    limit?: number,
    startId?: number,
  ): Promise<PaginationOutput> {
    const where: FindManyOptions<User>['where'] = {};
    let separateCount = 0;
    if (startId) {
      where.id = MoreThan(startId);
      separateCount = await this.usersRepository.count();
    }

    const [users, count] = await this.usersRepository.findAndCount({
      where,
      order: {
        id: 'ASC',
      },
      skip: offset,
      take: limit,
    });

    return {
      users,
      count: startId ? separateCount : count,
    };
  }

  async getUserById(id: number): Promise<User> {
    const user: User = await this.usersRepository.findOne({
      where: { id },
      relations: ['savedRecipes'],
    });
    if (user) return user;
    throw new UserNotFoundException(id);
  }

  async updateUser(id: number, user: UpdateUserDto): Promise<User> {
    await this.usersRepository.update(id, user);
    const updatedUser: User = await this.usersRepository.findOneBy({ id });
    if (updatedUser) {
      await this.clearCache();
      return updatedUser;
    }
    throw new UserNotFoundException(id);
  }

  async saveRecipe(id: number, recipe: Recipe): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['savedRecipes'],
    });
    if (!user) {
      throw new UserNotFoundException(id);
    }
    if (!user.savedRecipes) {
      user.savedRecipes = [recipe];
    } else {
      user.savedRecipes.push(recipe);
    }
    await this.usersRepository.save(user);
    await this.clearCache();
    return user;
  }

  async deleteUser(id: number) {
    const deleteResponse: DeleteResult = await this.usersRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new UserNotFoundException(id);
    }
    await this.clearCache();
  }
}
