import bcrypt from "bcrypt";
import dotenv from 'dotenv';
dotenv.config(); 

export default class User{
#username; //Nombre de usuario en la plataforma.
  #email;
  #password; //Almacenaremos la contraseña ya cifrada
  #levelSegurityPassword = 10; //! Pasarlo al env
  #first_name;
  #surnames;
  #profile_img;
  #iAmEnterprise;



  constructor(username, email) {
    this.#email = email;
    this.#username = username;
    
  }

  set username(username) {
    this.#username = username;
  }

  get username() {
    return this.#username;
  }

  set email(email) {
    this.#email = email;
  }

  get email() {
    return this.#email;
  }

   async setPassword(password) {
    this.#password =  await bcrypt.hash(password, this.#levelSegurityPassword);
  }

  get password() {
    return this.#password;
  }

  set firstName(name) {
    this.#first_name = name;
  }

  get firstName() {
    return this.#first_name;
  }

  set surnames(surnames) {
    this.#surnames = surnames;
  }

  get surnames() {
    return this.#surnames;
  }

  set iAmEnterprise(value) {
    this.#iAmEnterprise = value;
  }

  get iAmEnterprise() {
    return this.#iAmEnterprise;
  }

}