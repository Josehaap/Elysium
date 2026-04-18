import { httpResource,HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { TokenService } from 'src/app/core/services/token-service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})

export class btnFollowApi {
    private http = inject(HttpClient);

    private header = (username:string = '') => {
        return{
            accessToken: TokenService.getToken(), 
            usernameNow: username  
        }
                
    }
    public username = signal<string>('');

    public iAmFollow = httpResource<boolean>(() => {
        const username = this.username();
        if (!username) return undefined;
        return {
            url: `${environment.apiUrl}/user/follow`,
            method: 'GET',
            headers: this.header(username)
        }
    });
    
    /**
     * 
     * @param username el usuario el cual será a quien se seguirá, será sacado de la url 
     * @returns 
     */
    
    public insertFollow(username: string) {
        return this.http.post(`${environment.apiUrl}/user/follow`, {}, {
            headers: this.header(username)
        })
    }
}