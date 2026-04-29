import { Component, input } from '@angular/core';
import { Post } from '../../../../models/profile';
import { CardPost } from '../card-post/card-post';
@Component({
  selector: 'app-list-posts',
  imports: [CardPost],
  templateUrl: './list-posts.html',
  styleUrl: './list-posts.css',
})
export class ListPosts {
  public listPost= input.required<Post[]>();
}
