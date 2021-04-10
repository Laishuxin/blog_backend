import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';

@Module({
  controllers: [ArticlesController],
  providers: [],
})
export class ArticlesModule {}
