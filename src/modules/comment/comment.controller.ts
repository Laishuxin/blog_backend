import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @Get('list')
  findAll() {
    return this.commentService.findAll();
  }

  @Get('item/:articleId')
  findByArticleId(@Param('articleId') articleId: number) {
    return this.commentService.findByArticleId(articleId);
  }

  @Patch('item/:articleId')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete('item/:articleId')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
