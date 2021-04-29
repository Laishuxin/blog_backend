import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@ApiTags('article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post('creation')
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @Get('list')
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({name: 'sortKey', required: false})
  @ApiQuery({name:'isAsc', required: false})
  findMany(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Query('sortKey') sortKey = 'update_at',
    @Query('isAsc') isAsc: number = 0,
  ) {
    return this.articleService.findMany(offset, limit, sortKey, !!isAsc);
  }

  @Get('item/:id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }

  @Patch('item/:id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @Delete('item/:id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }
}
