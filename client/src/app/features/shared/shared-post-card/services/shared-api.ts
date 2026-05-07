import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { TokenService } from "src/app/core/services/token-service";
import { environment } from "src/environments/environment";
import { infoDataPost,  } from '../../../platform/pages/home-platform/models/home';
import { responseApiShared } from "../model/shared";

@Injectable({
  providedIn: 'root',
})
export class SharedApi {
  private http = inject(HttpClient);

 getPost(postId: string) {
  const headers = new HttpHeaders({
    accessToken: TokenService.getToken(),
    post_id: postId
  });

  return this.http.get<responseApiShared>(`${environment.apiUrl}/post/getPost`, {
    headers
  });
}
}
