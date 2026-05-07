import { Component, input } from '@angular/core';
import { infoDataPost } from 'src/app/features/platform/pages/home-platform/models/home';
import { PostCard } from '../post-card/post-card';
@Component({
  selector: 'app-post-list',
  imports: [PostCard],
  templateUrl: './post-list.html',
  styleUrl: './post-list.css',
})
export class PostList {
  public listPost = input.required<infoDataPost[]>();
}
