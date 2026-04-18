import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { accessToken } from 'src/app/features/shared/models/shared';
/**
 * Servicio que nos permitirá consultar eliminar todo sobre sessionStorage.
 */
@Injectable({
  providedIn: 'root',
})
export class TokenService {
  //!Pasar el nombre de accessToken al .env
  /**
   * 
   * @returns dede
   */
 static  getToken ():string{
    return sessionStorage.getItem('accessToken')?? "";
  }

  static  getIdToken ():string{
    const token:accessToken = jwtDecode(this.getToken())
    return token['id']; 
    
  }
  

  static  getUsenameToken ():string{
    const token:accessToken = jwtDecode(this.getToken())
    return token['username']; 
    
  }

  static setToken(token:string){
    sessionStorage.setItem('accessToken', token);
  }

 static logout() {
    sessionStorage.removeItem('accessToken');
  }

  static isLoggedIn(): boolean {
    return !!this.getToken();
  }
  
}
