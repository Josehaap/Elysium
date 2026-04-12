import { Component, input } from '@angular/core';
import { NgStyle } from '@angular/common';
import { CardActions } from 'src/app/features/post/components/post-card/card-actions/card-actions';
import { Post } from 'src/app/features/platform/pages/profile-platform/models/profile';
@Component({
  selector: 'app-card-post',
  imports: [NgStyle, CardActions],
  templateUrl: './card-post.html',
  styleUrl: './card-post.css',
})
export class CardPost {
    public infoPost  = input.required<Post>();
}
