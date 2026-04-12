import { Component, input } from '@angular/core';
import { CardActions } from './card-actions/card-actions';
import { infoDataPost } from '../../../platform/pages/home-platform/models/home';
@Component({
  selector: 'app-post-card',
  imports: [CardActions],
  templateUrl: './post-card.html',
  styleUrl: './post-card.css',
})
export class PostCard {
  public dataPost = input.required<infoDataPost>();
}
