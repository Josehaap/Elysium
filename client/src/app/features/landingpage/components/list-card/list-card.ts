import { Component, input } from '@angular/core';
import { Card } from '../../../shared/card/card';
import { ICard } from '../../../shared/card/models/card';
@Component({
  selector: 'app-list-card',
  imports: [Card],
  templateUrl: './list-card.html',
  styleUrl: './list-card.css',
})
export class ListCard {
  public dataCards = input.required<ICard[]>();
}
