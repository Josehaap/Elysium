

import express from 'express';
import UserController from '../controllers/user.controller.js';
const router = express.Router(); //Generamos una instancia de las funcione de enrutamiento. 
const user = new UserController();

/**
 * @File - Archivo utilizado para administrar las rutas de usuarios. 
 * @author Jose de Haro Jiménez. 
 */

//! Responde a, ¿Username o gmail están ya logeados.?
router.get('/register',user.getUserRegisterByValidation);

//? Validamos al usuario y lo registramos 
//!Recordar tener que hacer si el usuario es una entrprise es decir
//! Agregarlo a una tabla más y además enviar email.
router.post('/register', user.userRegister)


router.post('/login',user.userLoginValidate);

export default router;