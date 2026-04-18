import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { accessToken } from 'src/app/features/shared/models/shared';
/**
 * Servicio que nos permitirá consultar eliminar todo sobre sessionStorage.
 */
@Injectable({
  providedIn: 'root',
})
export class RoutingElysium {

     router = inject(Router); 

     goToProfile(username:string){
        this.router.navigate([`/elysium/profile/${username}`]);
    }
}
