import { Component } from '@angular/core';
import { PostList } from './components/post-list/post-list';
import {Ipost} from './models/ipost';
import {posts} from "./mokdata/postMock"

@Component({
  selector: 'app-post',
  imports: [PostList],
  templateUrl: './post.html',
  styleUrl: './post.css',
})
export class Post {
  public posts : Ipost[] = posts; 


}
