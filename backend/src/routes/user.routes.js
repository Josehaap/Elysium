

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
router.post('/register', user.userRegister)

export default router;