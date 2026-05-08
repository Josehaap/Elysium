import { Component, input, signal } from '@angular/core';
import { infoDataPost } from '../../../platform/pages/home-platform/models/home';

import { PostCard } from '../post-card/post-card';
import { SharePostModal } from '../../../shared/share-post-modal/share-post-modal';

@Component({
  selector: 'app-post-list',
  imports: [PostCard, SharePostModal],
  templateUrl: './post-list.html',
  styleUrl: './post-list.css',
})
export class PostList {
  public listPost = input.required<infoDataPost[]>();
  protected sharingPostId = signal<string | null>(null);

  handleOpenShare(postId: string) {
    this.sharingPostId.set(postId);
  }
}
