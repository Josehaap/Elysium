import express from "express";
import UserController from "../controllers/user.controller.js";
import UploadServices from "../core/middleware/upload.services.js";
import DashboardController from "../controllers/Dashboard.controller.js";
import ProfileController from "../controllers/Profile.controller.js";
import Token from "../core/middleware/Token.js";
const router = express.Router(); //Generamos una instancia de las funcione de enrutamiento.
const user = new UserController();
const dashboard = new DashboardController();
const profile = new ProfileController();

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

router.get("/dashboard", Token.validateToken,dashboard.getAllDataUser)

router.get("/profile/publish", Token.validateToken, profile.getAllPostUser)
router.get("/profile/data", Token.validateToken, profile.getAllDataUser)

export default router;
