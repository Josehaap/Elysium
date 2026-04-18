import { Component, inject } from '@angular/core';
import { Post } from '../../../post/post';
import { Router } from '@angular/router';
import { HomeApi } from './services/home-api';
import { environment } from 'src/environments/environment';
import { RoutingElysium } from 'src/app/core/services/routingElysium';
import { TokenService } from 'src/app/core/services/token-service';
import news from './mock/dataNews';
@Component({
  selector: 'app-home-platform',
  imports: [Post],
  templateUrl: './home-platform.html',
  styleUrl: './home-platform.css',
})
export class HomePlatform {
  protected homeApi = inject(HomeApi);
  protected router = inject(Router);
  protected routingElysium = inject(RoutingElysium);
  protected news = news;
  protected imgUser: string = new URL(this.homeApi.imgUserUrl,environment.apiUrl).toString() ;

  goToPerfil =() =>{
    this.routingElysium.goToProfile(TokenService.getUsenameToken());
  }
 
}
