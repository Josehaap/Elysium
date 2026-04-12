import { Component, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { UserExistsResponse  } from '../../models/form-register';
import { accessToken } from "src/app/features/shared/models/shared";

import { FormApi } from '../../service/form-api';
import { Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";
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
    //Diferentes comprobaciones antes de visulizar login: 

    //Comprobamos que no haya una sesión iniciada.  
    const getDataNavegador = sessionStorage.getItem('accessToken'); 
    //Luego hacemos la conversión si getData* es null lo devolvemos sino hacemos un parse a json
    const user : string | null = getDataNavegador ? getDataNavegador: null;

    //Si ya hay significa que ya está registrado por ende entraremos a la app del tirón.
    if(user) this.router.navigate(['elysium/home']);
    //? Esto aunque parezca un problema de seguridad no lo es ya que tenemos un auth-guardh 
    //? el cual comprobará la validez del token. 

    //Si llegamos hasta aquí significa que no hemos hecho un login anteriormente por ende: 
    //Comprobamos si venimos de registrarnos comprobando que hayamos recibido un email
    const emailRecibido = this.receptEmailUser();
    
    if (emailRecibido) {
      //Escribimo en el input el correo
      this.profileForm.patchValue({
        userIdentification: emailRecibido
      });

      //Redirigimos al correo del usuario
      setTimeout(()=>{
        window.open("https://mail.google.com/", "_blank");
      },3000);
    }
    
  }

  public userExists = output<UserExistsResponse>();
  onSubmit() {
    this.FormApi.validateLogin(this.profileForm.getRawValue()).subscribe({
      next:(res) =>{
        if ('isValid' in res.Data && res.Data.isValid) {
          console.log(res);
          console.log("Se guardará el accesToken en sessión:  "); 
          sessionStorage.setItem('accessToken', res.Data.accessToken );
          this.router.navigate(['elysium/home']);
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
