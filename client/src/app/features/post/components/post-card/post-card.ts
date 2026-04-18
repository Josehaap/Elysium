import { Component, inject, input } from '@angular/core';
import { infoDataPost } from '../../../platform/pages/home-platform/models/home';
import { RoutingElysium } from 'src/app/core/services/routingElysium';
import { btnFollow } from 'src/app/features/shared/btnFollow/btnFollow';
import { CardActions } from "./card-actions/card-actions";
@Component({
  selector: 'app-post-card',
  imports: [btnFollow, CardActions],
  templateUrl: './post-card.html',
  styleUrl: './post-card.css',
})
export class PostCard {

  protected routingElysium = inject(RoutingElysium);
  public dataPost = input.required<infoDataPost>();
  
}
