import { CacheModule, Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Recipe from './recipes.entity';

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([Recipe]),
    HttpModule.register({
      timeout: 2000,
      maxRedirects: 5,
    }),
    ConfigModule,
  ],
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}
