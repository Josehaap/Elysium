import { Component, input } from '@angular/core';

@Component({
  selector: 'app-options',
  imports: [],
  templateUrl: './options.html',
  styleUrl: './options.css',
})
export class Options {
  public name = input.required<string>();
  public iWantImg = input.required<boolean>();
  public img = input<string>();
  public title = input.required<string>();
  public subtitle = input.required<string>();
  public iWantCheck = input<boolean>();
  public icon = input<string>();
}
