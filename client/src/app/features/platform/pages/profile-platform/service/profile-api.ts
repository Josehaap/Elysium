import { httpResource,HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { TokenService } from 'src/app/core/services/token-service';
import { environment } from 'src/environments/environment';
import{responseApiProfilePost, responseApiProfileData, UpdateData, responseApiProfileChat} from '../models/profile';
@Injectable({
  providedIn: 'root',
})

export class ProfileApi {
    private http = inject(HttpClient);
    public usernameUrl = signal<string>(''); 

    
    public getProfileInfoPublish = httpResource<responseApiProfilePost>(() => {
      const username = this.usernameUrl();
      if (!username) return undefined;
      return {
        url: `${environment.apiUrl}${'/post/info'}`,
        method: 'GET',
        headers: {
          accessToken: TokenService.getToken(),
          usernameNow: username
        },
      }
    });

    public getProfileInfoUser = httpResource<responseApiProfileData>(() => {
      const username = this.usernameUrl();
      if (!username) return undefined;
      return {
        url: `${environment.apiUrl}${'/user/profile/data'}`,
        method: 'GET',
        headers: {
          accessToken: TokenService.getToken(),
          usernameNow: username
        },
      }
    });

    public updateProfileInfo = (formData:FormData, username:string ) =>{
      return this.http.post<boolean>(`${environment.apiUrl}/user/profile/update`, formData, {
        headers: {
          accessToken: TokenService.getToken() || '',
          usernameNow: username
        }
      }).subscribe({
        next: (resp) => {
          console.log('¡Servidor recibió el sobre!', resp);
          return resp
        },
        error: (err) => {
          console.error('El envío falló:', err, 'por ello vamos a reiniciar la pagina ');
          window.location.reload();
        }
      });
    }

    public updateChat = () => this.http.post<boolean>(`${environment.apiUrl}/chat/insertChat`, {}, {
        headers: {
          accessToken: TokenService.getToken() || '',
          usernameLoged: TokenService.getUsenameToken(), 
          usernameShow: this.usernameUrl()
        }
      })
    
   

    public existChat =httpResource<responseApiProfileChat>(()=>({
        url:`${environment.apiUrl}/chat/exists`,
        headers: {
          accessToken: TokenService.getToken() ?? '', 
          usernameLoged: TokenService.getUsenameToken(),
          usernameShow :this.usernameUrl()
        }
      }));

    
      
    
    
}
