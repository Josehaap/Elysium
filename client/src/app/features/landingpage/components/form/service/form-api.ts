import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserExistsResponse, UserLogin, UserRegister } from '../models/form-register';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FormApi {
  private http = inject(HttpClient);

  /**
   * Función que se utilizará para hacer peticiones para comprobar si los campos que son únicos existen o no. 
   * @param field Campo que vamos a visualizar
   * @param value Valor que quiero comprobar
   * @returns 
   */
  public iHaveThisUser(field: string, value: string): Observable<UserExistsResponse> {
    return this.http.get<UserExistsResponse>(`${environment.apiUrl}/user/register`, {
      params: { field: field, value: value },
    });
  }

  /**
   * Función para enviar los datos del formulario. 
   * @param data 
   * @returns 
   */
  public sendData(data: FormData): Observable<UserExistsResponse> {
    return this.http.post<UserExistsResponse>(`${environment.apiUrl}/user/register`, data);
  }

  /**
   * Función para validar las credenciales del login. 
   * @param data 
   * @returns 
   */
  public validateLogin(data:UserLogin):Observable<UserExistsResponse> {
    return this.http.post<UserExistsResponse>(`${environment.apiUrl}/user/login`, data)
  };

}
