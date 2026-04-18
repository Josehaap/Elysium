import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from 'src/app/core/services/token-service';
import { environment } from 'src/environments/environment';
import { SearchPlatformAPIResponse } from '../models/search-platform';

@Injectable({
  providedIn: 'root',
})

export class SearchApi {
  
  public getAllUser = httpResource<SearchPlatformAPIResponse>(()=>({
    url:`${environment.apiUrl}/user/search/getUsers`,
    headers: {
      accessToken: TokenService.getToken()
    }

  }));
  
}
