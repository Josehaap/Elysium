import { Component, inject } from '@angular/core';
import { IMenu } from './models/menu';
import { Router } from '@angular/router';
import { dataIcons } from './data/dataIcons';
@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  protected router = inject(Router);
  //Exportación de datos sobre los iconos. 
  protected icons: IMenu[] = dataIcons;

  /**
   * Método el cual detecta el id que se a clicado y modifica cada objtLiteral.active a true o false.
   * Además llama al método navegar(). 
   * @param event : Desde aqui accederemos al elemento html y a su id, el cual debera ser el id de cada objLiteral.
   */
  activeEvent(event: Event) {
    const elementoHtml = event.target as HTMLElement;
    this.icons.forEach((icon) => {
      icon.active = icon.id === elementoHtml.id;
    });
    
    this.navegar(elementoHtml.id);
  }

  //Devulve la ruta actual segun si está activado o no
  isActive(icon: any): string {
    return icon.active ? icon.pathActive : icon.pathNormal;
  }

  /**
   * Cuando selecciones un icono el id cambiará. 
   * @param id 
   */
  navegar(id: string) {
    switch (id) {
      case 'home':
        this.router.navigate(['elysium/home']);
        break;
      case 'chat':
        this.router.navigate(['elysium/chat']);
        break;
      case 'add':
        this.router.navigate(['elysium/add']);
        break;
      case 'search':
        this.router.navigate(['elysium/search']);
        break;
    }
  }
}
