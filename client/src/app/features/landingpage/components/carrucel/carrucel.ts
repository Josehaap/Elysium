import { Component, input } from '@angular/core';

@Component({
  selector: 'app-carrucel',
  imports: [],
  templateUrl: './carrucel.html',
  styleUrl: './carrucel.css',
})
export class Carrucel {
  /**
   * Input property for the array of image URLs to display in the carousel.
   */
  public urlImg = input.required<string[]>();
}
