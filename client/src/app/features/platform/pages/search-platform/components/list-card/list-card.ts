import { Component, input } from '@angular/core';
import { Card } from '../card/card';
import { DataUser } from '../../models/search-platform';

@Component({
  selector: 'app-list-card',
  imports: [Card],
  templateUrl: './list-card.html',
  styleUrl: './list-card.css',
})
export class ListCard {
  public listInfoCard = input.required<DataUser[]>();
}
