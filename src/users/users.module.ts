import { CacheModule, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './user.entity';
import { RecipesModule } from '../recipes/recipes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CacheModule.register(),
    RecipesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
