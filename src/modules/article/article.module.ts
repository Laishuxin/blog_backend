import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { UserService } from '../user/user.service';
import { TagService } from '../tag/tag.service';
import { CategoryService } from '../category/category.service';

@Module({
  controllers: [ArticleController],
  providers: [ArticleService, UserService, TagService, CategoryService],
})
export class ArticleModule {}
