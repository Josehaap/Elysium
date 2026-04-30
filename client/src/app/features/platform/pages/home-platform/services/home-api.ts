import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { TokenService } from 'src/app/core/services/token-service';
import { environment } from 'src/environments/environment';
import { ResponseSuggestedUsers, responseApiDashboard, ResponseApiNews } from '../models/home';
import { accessToken } from '../../../../shared/models/shared';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeApi {
  private http = inject(HttpClient);

  /**
   * Envía un mensaje al chatbot via el proxy de la plataforma
   */
  sendChatMessage(message: string) {
    return this.http.post<any>(
      `${environment.apiUrl}/chatbot/ask`,
      { message },
      {
        headers: {
          accessToken: TokenService.getToken(),
        }
      }
    ).pipe(
      map(res => res.Data ?? 'No se recibió respuesta.')
    );
  }
  /**
   * Función que nos devuelve un objeto literal con bastante información
   */
  public getDashboardInfo = httpResource<responseApiDashboard>(() => ({
    url: `${environment.apiUrl}${'/user/dashboard'}`,
    method: 'GET',
    headers: {
      accessToken: TokenService.getToken(),
    },
  }));

  /**
   * Hacemos una consulta para saber si el usuario ya ha seguido a algún usuario
   */
  public getNumberFollowed = httpResource<number>(() => ({
    url: `${environment.apiUrl}${'/user/dashboard/follows'}`,
    method: 'GET',
    headers: {
      accessToken: TokenService.getToken(),
    },
  }));

  public imgUserUrl: string = jwtDecode<accessToken>(TokenService.getToken())['profile_img'];

  /**
   * Obtiene una lista de usuarios sugeridos
   */
  public getSuggestedUsers = httpResource<ResponseSuggestedUsers>(() => ({
    url: `${environment.apiUrl}/user/search/getUsers`,
    method: 'GET',
    headers: {
      accessToken: TokenService.getToken(),
    },
  }));

  /**
   * Sigue a un usuario
   */
  followUser(username: string) {
    return this.http.post<any>(
      `${environment.apiUrl}/user/follow`,
      {},
      {
        headers: {
          accessToken: TokenService.getToken(),
          usernameNow: username,
        },
      }
    );
  }
}
