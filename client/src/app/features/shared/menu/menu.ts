import { Component, inject } from '@angular/core';
import { IMenu } from './models/menu';
import { Router, ActivatedRoute } from '@angular/router';
import { dataIcons } from './data/dataIcons';
@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  protected router = inject(Router);
  protected routerActivate = inject(ActivatedRoute)
  //Exportación de datos sobre los iconos. 
  protected icons: IMenu[] = dataIcons;

  // Mapa para relacionar el ID del icono con su ruta
  private routeMap: { [key: string]: string } = {
    'home': '/elysium/home',
    'chat': '/elysium/chat',
    'add': '/elysium/add',
    'search': '/elysium/search',
    'profile': '/elysium/profile'
  };

  constructor() {
    this.updateActiveState();
    // Escuchamos los cambios de ruta para mantener el menu sincronizado
    this.router.events.subscribe(() => {
      this.updateActiveState();
    });
  }

  /**
   * Sincroniza el estado 'active' de los iconos con la URL actual del navegador
   */
  private updateActiveState() {
    const currentUrl = this.router.url;
    this.icons.forEach((icon) => {
      icon.active = currentUrl.includes(this.routeMap[icon.id]);
    });
  }


  /**
   * Método el cual detecta el id que se a clicado y modifica cada objtLiteral.active a true o false.
   * Además llama al método navegar(). 
   * @param event : Desde aqui accederemos al elemento html y a su id, el cual debera ser el id de cada objLiteral.
   */
  

  activeEvent(event: Event) {
    const elementoHtml = event.target as HTMLElement;
    const id = elementoHtml.id;
    // La navegación disparará el evento del router que actualizará el estado active
    this.navegar(id);
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
      case 'profile':
        this.router.navigate(['elysium/profile']);
        break;
    }
  }
}
