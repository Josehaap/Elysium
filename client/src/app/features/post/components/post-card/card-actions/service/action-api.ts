import { HttpClient, HttpHeaders, httpResource } from '@angular/common/http';
import { inject, Injectable,Signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { TokenService } from 'src/app/core/services/token-service';
import { environment } from 'src/environments/environment';
import { accessToken } from '../../../../../shared/models/shared';
import { ResponseApiActions } from '../models/action';
@Injectable({
  providedIn: 'root',
})
export class ActionApi {

  public http = inject(HttpClient);
  protected getHeaders(post_id:string): HttpHeaders {
  return new HttpHeaders({
    accessToken: TokenService.getToken(), 
    post_id: post_id
  });
}
  /**
   * Función que nos devuelve un objeto literal con bastante información
   */
  public getPostInfo = (id: Signal<string | undefined>) => {
    return httpResource<ResponseApiActions>(() => {
      const postId = id();
      if (!postId) return undefined; 
      return {
        url: `${environment.apiUrl}/post/info`,
        method: 'GET',
        headers: {
          post_id: postId, 
        },
      };
    });
  };

  public insertLike(id:string){
    return this.http.post(`${environment.apiUrl}/post/Ilike`,null,{headers:this.getHeaders(id)} )
  }

  public deleteLike(id:string){
    return this.http.delete(`${environment.apiUrl}/post/Dlike`,{headers:this.getHeaders(id)} )
  }
}
