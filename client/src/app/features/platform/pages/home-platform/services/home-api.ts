import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { TokenService } from 'src/app/core/services/token-service';
import { environment } from 'src/environments/environment';
import { responseApiDashboard, ResponseApiNews } from '../models/home';
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
/*
  public getNewsInfo = httpResource<ResponseApiNews>(()=>({
    url: 'https://real-time-news-data.p.rapidapi.com/search',
  params: {
    query: 'moda',
    limit: 10,
    time_published: 'anytime',
    country: 'es',
    lang: 'es'
  },
  headers: {
    'x-rapidapi-host': 'real-time-news-data.p.rapidapi.com',
    'x-rapidapi-key': '2db12bbb6amsh0353e38d8e1aaecp19a51djsn731107066263'
    }
  }));*/
}
