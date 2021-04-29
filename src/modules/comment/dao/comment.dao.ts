export class CommentDao {
  comment_id: number;
  create_at: string;
  update_at: string;
  content: string;
  nickname: string;
  email: string;
  star: boolean

  article_id: number | null;
  parent_id: number | null;
}
