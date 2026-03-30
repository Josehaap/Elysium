import { Component, input, output } from '@angular/core';
import { ICard } from './models/card';
import { NgClass } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-card',
  imports: [RouterLink, NgClass],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  public data = input.required<ICard>();
}
