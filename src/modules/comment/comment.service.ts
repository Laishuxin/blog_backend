import { Injectable } from '@nestjs/common';
import { query } from 'src/database';
import { Comment } from './class/Comment';
import { CommentDao } from './dao/comment.dao';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  create(createCommentDto: CreateCommentDto) {
    return 'This action adds a new comment';
  }

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  async findByArticleId(articleId: number) {
    const sql = `
    SELECT 
  t_comment.comment_id comment_id,
  t_comment.create_at create_at,
  t_comment.update_at update_at,
  t_comment.content content,
  t_comment.nickname nickname,
  t_comment.email email,
  t_comment.star star,
  t_comment.article_id article_id,
  t_comment.parent_id parent_id
FROM
  t_comment 
  INNER JOIN t_article 
    ON t_comment.article_id = t_article.article_id 
WHERE t_comment.article_id = ${articleId}
    AND t_comment.parent_id IS NULL
  `;
    const parentComment = await query<CommentDao>(sql, {
      logging: true,
      convertToBoolean: true,
    });
    const comments = await this.mapChildrenComment(parentComment);
    return comments;
  }

  // TODO(rushui 2021-04-27): map data
  private async mapChildrenComment(parentComment: CommentDao[]) {
    const result: Comment[] = [];
    for (let i = 0, length = parentComment.length; i < length; i++) {
      const item: Comment = parentComment[i] as any;
      const sql = `
SELECT comment_id,
  create_at,
  update_at,
  content,
  nickname,
  email,
  star,
  article_id,
  parent_id
FROM
  t_comment
WHERE parent_id = ${item.comment_id}
      `;
      const cChildComment = await query(sql);
      item.childrenComment = cChildComment.length === 0 ? null : cChildComment;
      result.push(item);
    }
    return parentComment as any;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
