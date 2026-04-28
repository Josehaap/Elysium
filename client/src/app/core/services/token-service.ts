import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { accessToken } from 'src/app/features/shared/models/shared';
import { environment } from 'src/environments/environment';
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
  
  static  getProfileImg():string{
    const token:accessToken = jwtDecode(this.getToken())
    if (token.profile_img === '') return 'img/placeholder/profile/profile_userDefault.webp'
    if (token.profile_img.startsWith('http') || token.profile_img.startsWith('blob')) return token['profile_img']; 
    const newUrl = `${environment.apiUrl}/${token.profile_img}`; 
    return newUrl; 
    
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
