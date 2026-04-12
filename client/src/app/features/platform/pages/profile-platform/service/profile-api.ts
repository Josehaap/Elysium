import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from 'src/app/core/services/token-service';
import { environment } from 'src/environments/environment';
import{responseApiProfilePost, responseApiProfileData} from '../models/profile';
@Injectable({
  providedIn: 'root',
})

export class ProfileApi {
  
    public getProfileInfoPublish = httpResource<responseApiProfilePost>(() => ({
        url: `${environment.apiUrl}${'/post/info'}`,
        method: 'GET',
        headers: {
            accessToken: TokenService.getToken(),
        },
    }));
    
     public getProfileInfoUser = httpResource<responseApiProfileData>(() => ({
        url: `${environment.apiUrl}${'/user/profile/data'}`,
        method: 'GET',
        headers: {
            accessToken: TokenService.getToken(),
        },
    }));
}
