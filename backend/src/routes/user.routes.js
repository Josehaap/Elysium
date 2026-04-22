import express from "express";
import UserController from "../controllers/user.controller.js";

import UploadServices from "../core/middleware/upload.services.js";
import DashboardController from "../controllers/Dashboard.controller.js";
import ProfileController from "../controllers/Profile.controller.js";
import Token from "../core/middleware/Token.js";
import SearchController from "../controllers/searchController.js";
const router = express.Router(); //Generamos una instancia de las funcione de enrutamiento.
const user = new UserController();
const dashboard = new DashboardController();
const profile = new ProfileController();
const search = new SearchController();

/**
 * @File - Archivo utilizado para administrar las rutas de usuarios.
 * @author Jose de Haro Jiménez.
 */

//* Responde a, ¿Username o gmail están ya logeados.?
router.get("/register", user.getUserRegisterByValidation);

//? Validamos al usuario y lo registramos

//!Recordar tener que hacer si el usuario es una entrprise es decir
//! Agregarlo a una tabla más y además enviar email.

router.post("/register",UploadServices.validateImg().single("profile_img"), user.userRegister);

//Sacaremos la imagen y esta se guardará por ahora en una carpeta local
router.post("/login",user.userLoginValidate);

router.get("/userActivation", user.activateUser);


//*Información del home
router.get("/dashboard", Token.validateToken,dashboard.getAllDataUser);
router.get("/dashboard/follows", Token.validateToken,dashboard.getNumberFollowed);


//*Obtenemos los datos del usuario en el profile
router.get("/profile/publish", Token.validateToken, profile.getAllPostUser);
router.get("/profile/data", Token.validateToken, profile.getAllDataUser);
router.post("/profile/update", Token.validateToken, UploadServices.validateImg().single('profile_img'), profile.updateDataUser);

//*Comprobar si sigo a alguien o no. 
router.get("/follow", Token.validateToken, user.iAmFollow); 
router.post("/follow", Token.validateToken,user.iWantFollower ); 

//*INformacion sobre la pagina search

router.get('/search/getUsers', Token.validateToken, search.getAllUser);
router.get('/search/getUsersSameLike', Token.validateToken, search.getAllUserSameLike);

export default router;
