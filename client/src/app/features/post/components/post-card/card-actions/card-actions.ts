import { Component } from '@angular/core';

@Component({
  selector: 'app-card-actions',
  imports: [],
  templateUrl: './card-actions.html',
  styleUrl: './card-actions.css',
})
export class CardActions {
  public refillHead(svg: HTMLElement): void {
    /*Accedemos al atributo fil */
    svg.getAttribute('fill') === 'none'
      ? svg.setAttribute('fill', 'black')
      : svg.setAttribute('fill', 'none');
  }
}
