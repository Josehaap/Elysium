import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TokenService } from 'src/app/core/services/token-service';
import { environment } from 'src/environments/environment';
import { SearchPlatformAPIResponse } from '../models/search-platform';

@Injectable({
  providedIn: 'root',
})

export class SearchApi {
  protected http = inject(HttpClient); 
  
  public getAllUser = httpResource<SearchPlatformAPIResponse>(()=>({
    url:`${environment.apiUrl}/user/search/getUsers`,
    headers: {
      accessToken: TokenService.getToken()
    }
  }));

  public getUserSameLike = (input:string) => this.http.get<SearchPlatformAPIResponse>(`${environment.apiUrl}/user/search/getUsersSameLike`,{
    headers: {
      accessToken: TokenService.getToken(), 
      username : input
    }
  });
  
}
