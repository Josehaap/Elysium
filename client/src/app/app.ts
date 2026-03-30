import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from './features/shared/menu/menu';
import { Post } from './features/post/post';
import { Landingpage } from './features/landingpage/landingpage';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Landingpage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('client');
}
