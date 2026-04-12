import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from '../shared/menu/menu';
import { Router } from '@angular/router';
@Component({
  selector: 'app-platform',
  imports: [Menu, RouterOutlet],
  templateUrl: './platform.html',
  styleUrl: './platform.css',
})
export class Platform{
  public routeActive = inject(Router);
  
  
}
