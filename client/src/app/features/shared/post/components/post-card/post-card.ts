import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { infoDataPost } from '../../../../platform/pages/home-platform/models/home';
import { RoutingElysium } from 'src/app/core/services/routingElysium';
import { btnFollow } from 'src/app/features/shared/btnFollow/btnFollow';
import { CardActions } from './card-actions/card-actions';
import { environment } from 'src/environments/environment';
import { Comments } from 'src/app/features/shared/comments/comments';
import { CommentAction, CommentEvent } from 'src/app/features/shared/comments/models/message';

@Component({
  selector: 'app-post-card',
  imports: [btnFollow, CardActions, Comments],
  templateUrl: './post-card.html',
  styleUrl: './post-card.css',
})
export class PostCard {
  public dontViewActions = input<boolean>(true);
  protected routingElysium = inject(RoutingElysium);
  public dataPost = input.required<infoDataPost>();
  protected localCommentCount = linkedSignal(() => this.dataPost().comment);

  protected isExpanded = signal(false);
  protected isTitleExpanded = signal(false);
  protected iwantViewComment = signal(false);

  toggleExpand() {
    this.isExpanded.set(!this.isExpanded());
  }

  toggleTitle() {
    this.isTitleExpanded.set(!this.isTitleExpanded());
  }

  public imgUrlProfile = computed(() => {
    const imgProfile = this.dataPost().profile_img;
    if (
      imgProfile === '' ||
      imgProfile.startsWith('http') ||
      imgProfile.startsWith('blob') ||
      imgProfile.startsWith('img/placeholder')
    )
      return imgProfile;

    const newUrl = `${environment.apiUrl}/${imgProfile}`;
    console.log(newUrl);
    return newUrl;
  });
  public imgUrlPost = computed(() => {
    const imgPost = this.dataPost().post_id;
    if (
      imgPost === '' ||
      imgPost.startsWith('http') ||
      imgPost.startsWith('blob') ||
      imgPost.startsWith('img/placeholder')
    )
      return imgPost;

    const newUrl = `${environment.apiUrl}/${imgPost}`;
    console.log(newUrl);
    return newUrl;
  });

  protected handleCommentAction(event: CommentEvent) {
    switch (event.action) {
      case CommentAction.ADDED:
        this.localCommentCount.update((c) => c + 1);
        break;
      case CommentAction.DELETED:
        this.localCommentCount.update((c) => c - 1);
        break;
      case CommentAction.CLOSED:
        this.iwantViewComment.set(false);
        break;
    }
  }
}
