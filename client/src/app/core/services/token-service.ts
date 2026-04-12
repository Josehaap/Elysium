import { Injectable } from '@angular/core';
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
  
  static setToken(token:string){
    sessionStorage.setItem('accessToken', token);
  }

 static  logout() {
    sessionStorage.removeItem('accessToken');
  }

  static isLoggedIn(): boolean {
    return !!this.getToken();
  }
  
}
