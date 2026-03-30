import { Component, input } from '@angular/core';
import {Ipost} from '../../models/ipost';
import { PostCard } from '../post-card/post-card';
@Component({
  selector: 'app-post-list',
  imports: [PostCard],
  templateUrl: './post-list.html',
  styleUrl: './post-list.css',
})
export class PostList {
  public listPost = input.required<Ipost[]>(); 
}
