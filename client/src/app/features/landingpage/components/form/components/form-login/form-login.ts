import { Component, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { UserLogin, UserExistsResponse } from '../../models/form-register';
import { FormApi } from '../../service/form-api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-login',
  imports: [ReactiveFormsModule], 
  templateUrl: './form-login.html',
  styleUrl: './form-login.css',
})
export class FormLogin {
  protected FormApi = inject(FormApi);
  protected router = inject(Router);
  public receptEmailUser = input<string>(); //No es un campo requerido ya que no lo necesitamos para contruir el login
  
  //? Recordar userIdentification ya que puede ser username y email. 
  profileForm = new FormGroup({
    userIdentification: new FormControl<string>('',{
      nonNullable: true,
      validators: Validators.required
    }),
    password: new FormControl<string>('',{
      nonNullable: true,
      validators: Validators.required
    })
  })

  

  
  ngOnInit() {
    
    //Sacamos al usuario almacenado si existiese: 
    //Comprobamos en local o session storage: 
    const getDataNavegador = localStorage.getItem('user') ?? sessionStorage.getItem('user');
    //Luego hacemos la conversión si getData* es null lo devolvemos sino hacemos un parse a json
    const user : UserExistsResponse | null = getDataNavegador ? JSON.parse(getDataNavegador) : getDataNavegador;

    //Si no es null y data es de un tipo específico comprobaremos que el usuario sea válido
    //Si ya hay significa que ya está registrado por ende entraremos a la app del tirón.
    if(user !== null && 'isValid' in user.Data && user.Data.isValid) this.router.navigate(['elysium/home']);
    //Si no mostraremos el email escrito en el registro si venimos de el. 

    const emailRecibido = this.receptEmailUser();

    if (emailRecibido) {
      this.profileForm.patchValue({
        userIdentification: emailRecibido
      });
    }
    
  }

  public userExists = output<UserExistsResponse>();
  onSubmit() {
    this.FormApi.validateLogin(this.profileForm.getRawValue()).subscribe({
      next:(res) =>{
        if ('isValid' in res.Data && res.Data.isValid) {
          console.log("Vamos a navegar al home.  "); 
          console.log(res)
          
        }else{
          console.log("La contraseña no es váida")
        }
      },
      error:(err) =>{
        console.log(err.error)
        this.userExists.emit(err.error);
      },
    });
  }

}
