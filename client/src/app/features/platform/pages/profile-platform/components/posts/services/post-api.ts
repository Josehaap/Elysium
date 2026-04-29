import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { TokenService } from 'src/app/core/services/token-service';
import { environment } from 'src/environments/environment';
import { responseApi } from '../model/post';
@Injectable({
  providedIn: 'root',
})
export class PostApi {
  private http = inject(HttpClient);

  public deleteProfile = (username: string, post_id: string) => {
    return this.http.delete<responseApi>(`${environment.apiUrl}/post/delete`, {
      headers: {
        accessToken: TokenService.getToken() || '',
        username: TokenService.getUsenameToken() || '',
        usernameNow: username,
        post_id: post_id,
      },
    });
  };

  public updatePost = (post_id: string, title: string, description: string) => {
    return this.http.put<responseApi>(
      `${environment.apiUrl}/post/update`,
      { title, description },
      {
        headers: {
          accessToken: TokenService.getToken() || '',
          post_id: post_id,
        },
      }
    );
  };
}
