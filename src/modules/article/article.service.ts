import { Injectable } from '@nestjs/common';
import { query } from 'src/database';
import { IServiceResponse, ServiceCode } from '..';
import { CategoryService } from '../category/category.service';
import { TagService } from '../tag/tag.service';
import { User } from '../user/class/user';
import { UserService } from '../user/user.service';
import { ArticleItem, ArticleList } from './class/article';
import { ArticleDao } from './dao/article.dao';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    private userService: UserService,
    private tagService: TagService,
    private categoryService: CategoryService,
  ) {}

  create(createArticleDto: CreateArticleDto) {
    return 'This action adds a new article';
  }

  public async findMany(
    offset: number,
    limit: number,
    sortKey: string,
    isAsc: boolean,
  ): Promise<IServiceResponse<ArticleItem[]>> {
    const sql = `
SELECT 
article_id,
create_at,
update_at,
title,
description,
content,
first_picture,
views,
appreciated,
commendable,
published,
star,
sharable,
user_id,
category_id 
FROM
  t_article 
ORDER BY ${sortKey} ${isAsc ? 'ASC' : 'DESC'}
LIMIT ${offset}, ${limit};`;
    const result = await query<ArticleDao>(sql);

    const data = await this.mapData(result);
    return {
      code: ServiceCode.SUCCESS,
      message: 'success',
      data,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} article`;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }

  // TODO(rushui 2021-04-26): fill with
  private async getUser(userId: string): Promise<User | null> {
    const user = await this.userService.findOneByUserId(userId);
    const result = user.data ? UserService.getUser(user.data) : null;
    return result;
  }

  private async getCategory(categoryId: number): Promise<string | null> {
    if (!categoryId) return null;
    return this.categoryService.findOneById(categoryId);
  }

  private async getTagsByArticleId(
    articleId: number,
  ): Promise<string[] | null> {
    if (articleId === undefined || articleId === null) return [];

    const tags = await this.tagService.findByArticleId(articleId);
    return tags;
  }

  private async mapData(articleDaoList: ArticleDao[]): Promise<ArticleItem[]> {
    // TODO(rushui 2021-04-26): delete log
    const result: ArticleItem[] = [];
    for (let i = 0, len = articleDaoList.length; i < len; i++) {
      const item = articleDaoList[i];
      const user = await this.getUser(item.user_id);
      const category = await this.getCategory(item.category_id);
      const tags = await this.getTagsByArticleId(item.article_id);

      delete item.user_id;
      delete item.category_id;

      result.push({
        ...item,
        user,
        category,
        tags,
      } as any);
    }
    return result;
  }
}
