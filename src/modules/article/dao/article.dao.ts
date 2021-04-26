export class ArticleDao {
  article_id: number;
  create_at: string;
  update_at: string;
  title: string;
  description: string;
  content: string;
  first_picture: string;
  views: number;

  appreciated: boolean;
  commendable: boolean;
  published: boolean;
  star: boolean;
  sharable: boolean;

  user_id?: string;
  category_id?: number;
}

export enum ArticleDaoFields {
  articleId = 'article_id',
  createAt = 'create_at',
  updateAt = 'update_at',
  title = 'title',
  description = 'description',
  content = 'content',
  firstPicture = 'first_picture',
  views = 'views',

  appreciated = 'appreciated',
  commendable = 'commendable',
  published = 'published',
  star = 'star',
  sharable = 'sharable',

  userId = 'user_id',
  categoryId = 'category_id',
}

export enum ArticleListSortKey {
  updateAt = 'updateAt',
  createAt = 'createAt',
}
