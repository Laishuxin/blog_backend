import { User } from 'src/modules/user/class/user';

export class ArticleItem {
  articleId: number;
  createAt: string;
  updateAt: string;
  title: string;
  description: string;
  content: string;
  firstPicture: string;
  views: number;

  appreciated: boolean;
  commendable: boolean;
  published: boolean;
  star: boolean;
  sharable: boolean;

  user: User | null;
  category: string | null
  tags: string[] | null
}

export class ArticleList {
  articleList: ArticleItem[];
}

export class ArticleListSchema {
  count: number;
  limit: number;
  offset: number;
  data: ArticleList;
}
