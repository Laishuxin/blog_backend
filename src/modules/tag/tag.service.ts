import { Injectable } from '@nestjs/common';
import { query } from 'src/database';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  create(createTagDto: CreateTagDto) {
    return 'This action adds a new tag';
  }

  findAll() {
    return `This action returns all tag`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  async findByArticleId(articleId: number) {
    const sql = `SELECT name FROM t_tag 
    INNER JOIN t_article_tag ON t_tag.tag_id = t_article_tag.tag_id 
    WHERE article_id = ${articleId}`;
    const result = await query(sql)
    return result.map(item => item.name)
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}
