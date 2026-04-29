import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { TokenService } from 'src/app/core/services/token-service';
import { environment } from 'src/environments/environment';
import { IMessage, ResponseCommmentAPI } from '../models/message';
@Injectable({
  providedIn: 'root',
})
export class CommentApi {
  private http = inject(HttpClient);


  public insertComment(idPost:string, message:string){
    return this.http.post(`${environment.apiUrl}/post/insertComment`,{},{
      headers:{
        accessToken:TokenService.getToken(),
        idPost:idPost, 
        message: message
      }
    });
  }

  public deleteComment(idComment: number) {
    return this.http.delete(`${environment.apiUrl}/post/deleteComment`, {
      headers: {
        accessToken: TokenService.getToken(),
        idComment: idComment.toString()
      }
    });
  }


  public getComents = (idPost: () => any) => httpResource<ResponseCommmentAPI>(() => {
    return {
      url: `${environment.apiUrl}/post/getComment`,
      method: 'GET',
      headers: {
        accessToken: TokenService.getToken(),
        idPost: idPost()
      },
    }
  });
  

}
