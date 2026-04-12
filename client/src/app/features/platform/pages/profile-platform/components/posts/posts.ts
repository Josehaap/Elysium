import { Component, input } from '@angular/core';
import { Post} from '../../models/profile';
import { ListPosts } from './components/list-posts/list-posts';

@Component({
  selector: 'app-posts',
  imports: [ListPosts],
  templateUrl: './posts.html',
  styleUrl: './posts.css',
})
export class Posts {
  public listPost= input.required<Post[]>();
}
