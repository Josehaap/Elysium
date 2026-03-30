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

  ngOnInit(){
    const navigation = this.routeActive.getCurrentNavigation();
  const state = navigation?.extras.state as {data: any};
  console.log(state?.data);
    //!IMplementar esto nada más cargar en el home. 
          //localStorage.setItem('user', JSON.stringify(res));
          //sessionStorage.setItem('user', JSON.stringify(res));
  }
  
}
