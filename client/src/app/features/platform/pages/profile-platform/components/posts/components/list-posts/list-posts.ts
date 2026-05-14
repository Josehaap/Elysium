import { Component, inject, input, signal, ViewChildren, QueryList } from '@angular/core';
import { Post } from '../../../../models/profile';
import { CardPost } from '../card-post/card-post';
import { SharePostModal } from 'src/app/features/shared/share-post-modal/share-post-modal';
import { ProfileCommentDrawer } from '../profile-comment-drawer/profile-comment-drawer';
import { CommentAction, CommentEvent } from 'src/app/features/shared/comments/models/message';
import { ActionApi } from 'src/app/features/post/components/post-card/card-actions/service/action-api';
import { TokenService } from 'src/app/core/services/token-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list-posts',
  imports: [CardPost, SharePostModal, ProfileCommentDrawer],
  templateUrl: './list-posts.html',
  styleUrl: './list-posts.css',
})
export class ListPosts {
  private actionApi = inject(ActionApi);

  @ViewChildren(CardPost) postCards!: QueryList<CardPost>;

  public listPost = input.required<Post[]>();
  protected sharingPostId = signal<string | null>(null);
  protected commentingPost = signal<Post | null>(null);

  handleOpenShare(postId: string) {
    this.sharingPostId.set(postId);
  }

  handleShared(chatId: string) {
    const postId = this.sharingPostId();
    if (!postId) return;

    // 1. Incrementar contador en el backend
    this.actionApi.insertShared(postId).subscribe({
      next: () => {
        const post = this.listPost().find(p => p.id === postId);
        if (post) post.shared++;
      }
    });

    // 2. Enviar mensaje por WebSocket
    const wsUrl = environment.apiUrl.replace('http://', 'ws://').replace('https://', 'wss://');
    const socket = new WebSocket(wsUrl);
    socket.onopen = () => {
      socket.send(JSON.stringify({
        chat_id: chatId,
        user_send_id: Number(TokenService.getIdToken()),
        content: 'Ha compartido una publicación',
        post_id: postId
      }));
      setTimeout(() => socket.close(), 1000);
    };

    // 3. Cerrar modal
    this.sharingPostId.set(null);
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
