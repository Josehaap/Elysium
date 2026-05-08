import { Component, input, signal } from '@angular/core';
import { Post } from '../../../../models/profile';
import { CardPost } from '../card-post/card-post';
import { SharePostModal } from 'src/app/features/shared/share-post-modal/share-post-modal';

@Component({
  selector: 'app-list-posts',
  imports: [CardPost, SharePostModal],
  templateUrl: './list-posts.html',
  styleUrl: './list-posts.css',
})
export class ListPosts {
  public listPost = input.required<Post[]>();
  protected sharingPostId = signal<string | null>(null);

  handleOpenShare(postId: string) {
    this.sharingPostId.set(postId);
  }
}
