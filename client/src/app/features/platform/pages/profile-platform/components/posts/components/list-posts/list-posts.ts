import { Component, input, signal, ViewChildren, QueryList } from '@angular/core';
import { Post } from '../../../../models/profile';
import { CardPost } from '../card-post/card-post';
import { SharePostModal } from 'src/app/features/shared/share-post-modal/share-post-modal';
import { ProfileCommentDrawer } from '../profile-comment-drawer/profile-comment-drawer';
import { CommentAction, CommentEvent } from 'src/app/features/shared/comments/models/message';

@Component({
  selector: 'app-list-posts',
  imports: [CardPost, SharePostModal, ProfileCommentDrawer],
  templateUrl: './list-posts.html',
  styleUrl: './list-posts.css',
})
export class ListPosts {
  @ViewChildren(CardPost) postCards!: QueryList<CardPost>;

  public listPost = input.required<Post[]>();
  protected sharingPostId = signal<string | null>(null);
  protected commentingPost = signal<Post | null>(null);

  handleOpenShare(postId: string) {
    this.sharingPostId.set(postId);
  }

  handleOpenComments(post: Post) {
    this.commentingPost.set(post);
  }

  handleCloseComments() {
    this.commentingPost.set(null);
  }

  handleDrawerCommentAction(event: CommentEvent) {
    const post = this.commentingPost();
    if (!post) return;
    
    // Mutate local state if we want, or the child handles it
    if (event.action === CommentAction.ADDED) {
      post.comment++;
    } else if (event.action === CommentAction.DELETED) {
      post.comment--;
    } else if (event.action === CommentAction.CLOSED) {
      this.commentingPost.set(null);
    }

    // Update the specific card's local comment count
    const card = this.postCards.find(c => c.infoPost().id === post.id);
    if (card) {
      card.updateCommentCount(event.action);
    }
  }
}
