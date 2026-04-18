import { Component, inject, input } from '@angular/core';
import { PostList } from './components/post-list/post-list';
//import {posts} from "./mokdata/postMock"
import { infoDataPost } from '../platform/pages/home-platform/models/home';
import { Router } from '@angular/router';
import { RoutingElysium } from 'src/app/core/services/routingElysium';
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
