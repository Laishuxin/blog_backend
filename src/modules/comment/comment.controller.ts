import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

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
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
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