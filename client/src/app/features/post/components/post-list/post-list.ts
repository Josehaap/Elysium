import { Component, input, signal } from '@angular/core';
import { infoDataPost } from '../../../platform/pages/home-platform/models/home';

import { PostCard } from '../post-card/post-card';
import { SharePostModal } from '../../../shared/share-post-modal/share-post-modal';
import { ActionApi } from '../post-card/card-actions/service/action-api';
import { inject } from '@angular/core';
import { TokenService } from 'src/app/core/services/token-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-post-list',
  imports: [PostCard, SharePostModal],
  templateUrl: './post-list.html',
  styleUrl: './post-list.css',
})
export class PostList {
  private actionApi = inject(ActionApi);

  public listPost = input.required<infoDataPost[]>();
  protected sharingPostId = signal<string | null>(null);
  protected sharedSuccessPostId = signal<string | null>(null);

  handleOpenShare(postId: string) {
    this.sharingPostId.set(postId);
  }

  handleShared(chatId: string) {
    const postId = this.sharingPostId();
    if (!postId) return;

    // 1. Incrementar contador en el backend
    this.actionApi.insertShared(postId).subscribe({
      next: () => {
        const post = this.listPost().find(p => p.post_id === postId);
        if (post) post.shared++;
        this.sharedSuccessPostId.set(postId);
        setTimeout(() => this.sharedSuccessPostId.set(null), 100);
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
}
