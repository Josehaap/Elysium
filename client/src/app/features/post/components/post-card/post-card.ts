import { Component, input } from '@angular/core';
import {Ipost} from '../../models/ipost'
import { CardActions } from './card-actions/card-actions';
@Component({
  selector: 'app-post-card',
  imports: [CardActions],
  templateUrl: './post-card.html',
  styleUrl: './post-card.css',
})
export class PostCard {
  public dataPost = input.required<Ipost>();
}
