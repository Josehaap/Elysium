import { Component, input } from '@angular/core';
import { dataLanding } from '../../data/dataLandingPage';
import { IHeader } from './models/header';
import { RouterLink } from "@angular/router";
@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})

//Importamos los datos: 
export class Header {
  public dataHeader = input.required<IHeader>();


  //TODO - Ver como hacer la implementación en las rutas. 
  irASeccion(id:string) {
    console.log(id)
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
}
