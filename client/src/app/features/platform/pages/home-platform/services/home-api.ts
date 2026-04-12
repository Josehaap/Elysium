import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { TokenService } from 'src/app/core/services/token-service';
import { environment } from 'src/environments/environment';
import { responseApiDashboard } from '../models/home';
import { accessToken } from '../../../../shared/models/shared';
@Injectable({
  providedIn: 'root',
})
export class HomeApi {
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

  public imgUserUrl: string = jwtDecode<accessToken>(TokenService.getToken())['profile_img'];
}
