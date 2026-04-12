import { Component, CSP_NONCE } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormLogin } from './components/form-login/form-login';
import { FormRegister } from './components/form-register/form-register';
import { Alert } from '../../../shared/alert/alert';
import { dataLanding } from '../../data/dataLandingPage';
import { UserExistsResponse } from './models/form-register';

@Component({
  selector: 'app-form',
  imports: [NgClass, FormLogin, FormRegister, Alert],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form {
  protected userExist = false;
  protected messageAlert =
    'Antes de poder logearte deberás activar su correo, se le enviará al correo. ';
  protected ifUserExistsMessage = '';
  protected ifUserExistsAlertLevel = '';
  protected iWantLogin = true;

  /**
   * Función que determina que tipo de fomrulario se va ha visualizar;
   * @param {Event} event Referencia de la opcion (p => html) a la cual hayamos hecho click.
   */

  selectedOption(event: Event): void {
    const p = event.target as HTMLParagraphElement;
    //Cuando cambiamos de pestañas formateamos de nuevo el valor a falsae para no ver la alerta sin necesidad de hacer una petición.
    this.userExist = false;
    this.iWantLogin = p.textContent === 'login' ? true : false;
  }

  /**
   * Esta función nos permitirá visualizar las alertas o posibles errores que sucedan como credenciales vacias etc.
   * @param response Es la resouesta del servidor 
   */
  isUserExist(response: UserExistsResponse) {
    //*Hacemos las comprobaciones de que data respete la interfaz que esperamos
    //Significará que el usuario ya existía
    if (response.Success && 'exists' in response.Data) {
      this.userExist = response.Data.exists;
      this.ifUserExistsAlertLevel = 'warning';
      this.ifUserExistsMessage = 'El usuario ya existe.';
    } else {
      this.userExist = true;
      this.ifUserExistsAlertLevel = 'info';
      this.ifUserExistsMessage = response.Error;
    }
  }


  
  protected userEmail: string = ''; //Parametro que se rellenará una vez el login se haya hecho.


  //Función que nos permite visualizar (no ir) al componente login . 
  goToLogin(response: UserExistsResponse) {
    if ('exists' in response.Data) {
      this.iWantLogin = response.Data.exists; //Cambiamos la vista
      //this.userExist = response.Data.exists;
      this.userEmail = response.Data.email;
    }
  }
}
