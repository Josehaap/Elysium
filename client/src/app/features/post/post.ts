import { Component, input } from '@angular/core';
import { PostList } from './components/post-list/post-list';
//import {posts} from "./mokdata/postMock"
import { infoDataPost } from '../platform/pages/home-platform/models/home';
@Component({
  selector: 'app-post',
  imports: [PostList],
  templateUrl: './post.html',
  styleUrl: './post.css',
})
export class Post {
  //public posts : Ipost[] = posts;
  public posts = input.required<infoDataPost[]>();
}
