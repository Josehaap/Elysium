import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TokenService } from 'src/app/core/services/token-service';
import { environment } from 'src/environments/environment';
import { SubmitPost } from '../model/post';
@Injectable({
    providedIn: 'root',
})
export class AddApi {
    private http = inject(HttpClient);

    public submitPost = (formData: FormData) => {
        const headers = new HttpHeaders({
            accessToken: TokenService.getToken(), 
            submitPost : 1, 
        });
        return this.http.post(`${environment.apiUrl}/post/add`, formData, { headers });
    }
}
