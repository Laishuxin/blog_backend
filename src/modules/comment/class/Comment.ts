import { CommentDao } from '../dao/comment.dao';

export class Comment extends CommentDao {
  childrenComment: Comment[] | null;
}
