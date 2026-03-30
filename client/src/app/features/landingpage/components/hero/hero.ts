import { Component, input } from '@angular/core';
import { ICard } from '../../../shared/card/models/card';
@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
 public data = input.required<ICard>();
}
