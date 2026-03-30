import { Component, inject, input, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormApi } from '../../service/form-api';
import { UserExistsResponse } from '../../models/form-register';

@Component({
  selector: 'app-form-register',
  imports: [ReactiveFormsModule],
  templateUrl: './form-register.html',
  styleUrl: './form-register.css',
})
export class FormRegister {
  profileForm = new FormGroup({
    first_name: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
        this.noSoloEspaciosValidator,
      ],
    }),
    surnames: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(200),
        this.noSoloEspaciosValidator,
      ],
    }),
    username: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        this.noSoloEspaciosValidator,
      ],
    }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email,
        Validators.maxLength(100),
        this.noSoloEspaciosValidator,
      ],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255), this.noSoloEspaciosValidator],
    }),
    profile_img: new FormControl<File | null >(null, {
      validators: [Validators.maxLength(200)],
    }),
    iAmEnterprise: new FormControl<boolean>(false, { nonNullable: true }),
  });
  // Validador personalizado //! Controla que no sea espacio en blanco.
  noSoloEspaciosValidator(control: AbstractControl): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { soloEspacios: true } : null;
  }
  protected formService = inject(FormApi);
  public userExists = output<UserExistsResponse>();
  protected isvalidUser = true;
  /**
   * Funciónutilizada en los input con @id username y email.
   * Esta función nos permitirá darle un feedback al usuario para ver si el nombre de usuario o su email ya está registrado.
   * @param event Input al cual se está escribiendo
   */
  checkUser(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const field = input.id;
    //Pasamos como parámetro si es el email o el username y su valor.
    this.formService.iHaveThisUser(field, value).subscribe({
      next: (response) => {
        //Comprobamos que la respuesta sea la esperada: 
        if ('exists' in response.Data) {
          this.isvalidUser = response.Data.exists;
          this.userExists.emit(response);                    
        }
      },
    });
  }
  //Cuando se logee el usuario devolveremos true o false
  public userIsNowLogin = output<UserExistsResponse>();
  onSubmit() {
    console.log(this.profileForm.getRawValue());
    //Enviamos al usuario al backend para registrarlos
    this.formService.sendData(this.profileForm.getRawValue()).subscribe({
      next: (res) => {
        console.log('Respuesta correcta - ');
        this.userIsNowLogin.emit(res); //Enviamos la respuesta
      },
      error: (err) => {
        console.log(err.error);
        console.log('Respuesta erronea ');
        this.userExists.emit(err.error);
      },
    });
  }
}
