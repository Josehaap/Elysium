import { Component, inject } from '@angular/core';
import { Post } from '../../../post/post';
import { Router } from '@angular/router';
import { HomeApi } from './services/home-api';
@Component({
  selector: 'app-home-platform',
  imports: [Post],
  templateUrl: './home-platform.html',
  styleUrl: './home-platform.css',
})
export class HomePlatform {
  protected homeApi = inject(HomeApi);
  protected router = inject(Router);

  protected imgUser: string = this.homeApi.imgUserUrl;
  /**
   * Vamos a obtener diferentes información sobre el usuario:
   */
  ngOnInit() {
    //Obtenemos la foto de perfil del usuario:
    console.log(this.homeApi.getDashboardInfo.value());
  }

  goToPerfil() {
    this.router.navigate(['elysium/chat']);
  }
}
