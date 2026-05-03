import UserService from "../services/user.services.js";
import Helper from "../utils/helpers.js";
import UserValidators from "../validators/UserValidators.js";
import User from "../core/model/User.js";
import Exception from "../utils/exceptions.js";
import bcrypt from "bcrypt";
import Email from "../utils/email/Email.js";
import crypto from "crypto";
const helper = new Helper();
import jwt from "jsonwebtoken";
import UploadServices from "../core/middleware/upload.services.js";
import pool from "../core/config/database/db.js";
import { resolveNaptr } from "dns";
/**
 * @class UserController
 * @description Clase que es utilizada para aplicar la lógica de las inteeraciones en las rutas, especialida para ser un puente entre la capa de rutas y la capa
 * de servicio, será utilizada para generar métodos que validen y se comuniquen con los servicios pertinentes en la clase UserService y obtener los datos para
 *  luego devolverselo al frontend.
 */
export default class UserController {
  #userService = new UserService();

  //* Estructura por defecto de una respuesta
  #response = {
    Success: null,
    Data: null,
    Error: null,
  };
  //*Valores por defecto si se detecta un error.
  #valuesError = [false, {}, "Hubo un error inesperado"];

  //*Método que se usará para ver informacióncuando se esté registrando un usuario este le dirá si el usuario existe o no, ya.
  getUserRegisterByValidation = async (req, res) => {
    try {
      const { field, value } = req.query; //Pasamos los parámetros

      if (!field || field === undefined || field === "")
        throw new Error("Campo vacío"); //Lanzamos un error si los campos no existen o están vacios

      //*Hacemos la query pertinente
      const RESPONSE = await this.#userService.getUserBy(field, value, false);
      //Si no existelanzamos un error.
      if (!RESPONSE)
        return res
          .status(400)
          .send(
            helper.generateLiteralObject(this.#response, this.#valuesError),
          );
      //Si existe pero no hay nada respondemos la petición
      if (RESPONSE.length !== 0)
        return res
          .status(200)
          .send(
            helper.generateLiteralObject(this.#response, [
              true,
              { exists: true },
              "",
            ]),
          );
      else
        return res
          .status(200)
          .send(
            helper.generateLiteralObject(this.#response, [
              true,
              { exists: false },
              "",
            ]),
          );
    } catch (error) {
      this.#valuesError[2] = (error instanceof Exception) ? error.message: this.#valuesError[2]; 
      
      res.status((error instanceof Exception) ? 400 : 500).send(helper.generateLiteralObject(this.#response, this.#valuesError));
    }
  };

  /**
   * Método para el registro de un usuario.
   * @param {*} req
   * @param {*} res
   * @returns
   */
  userRegister = async (req, res) => {
    try {
      //Comprobamos las claves y luego los valores.
      UserValidators.validateKeys(req.body);
      UserValidators.validateValues(req.body);
      const data = req.body;
      //Si  todo ha salido bien instanciamos al usuario
      let user = new User(data.username, data.email);
      user.firstName = data.first_name;
      //Esperamos que se codifiquen la contraseña.
      await user.setPassword(data.password);
      user.surnames = data.surnames;
      //Si el usuario ha dicho que es una empresa por defecto en la base de datos su cuenta estará desactividada.
      user.iAmEnterprise =
        data.iAmEnterprise === "true" || data.iAmEnterprise === true ? 0 : 1;
      // Comprobamos si multer capturó un archivo e inyectamos la ruta al usuario para insertarlo en BD

      if (req.file) {
        user.profile_img = UploadServices.getRelativePath(req.file.path);
      } else {
        user.profile_img = "";
      }
      //Hacemos dos comprobaciones importantes:
      const USERNAMEEXIST = await this.#userService.getUserBy(
        "username",
        user.username,
      );
      if (USERNAMEEXIST && USERNAMEEXIST.length > 0)
        throw new Exception("Ya existe el nombre de la cuenta de usuario");
      //Comprobamos el email
      const EMAILEXIST = await this.#userService.getUserBy("email", user.email);
      if (EMAILEXIST && EMAILEXIST.length > 0)
        throw new Exception("Ya existe el email del usuario");

      // Generamos un token único e irrepetible para este usuario
      const tokenActivacion = crypto.randomUUID();
      // Se lo asignamos dinámicamente al objeto user para enviarlo al servicio
      user.activationToken = tokenActivacion;
      //? - Insertamos el usuario
      //*El usuario se logeará pero sin estár activado.
      const RESPONSE = await this.#userService.insertUser(user);
      //Si recibimos null significa que ha sido un error critico del servidor.
      if (RESPONSE === null)
        return res
          .status(500)
          .send(
            helper.generateLiteralObject(this.#response, this.#valuesError),
          );
      //Encambio si recibimos false significa que el usuario ya está registrado
      if (!RESPONSE[0])
        return res
          .status(409)
          .send(helper.generateLiteralObject(this.#response, RESPONSE));

      //Si todo está genial y es una empresa enviamos un correo - correo de activación
      if (user.iAmEnterprise === 0) {
        //Significa que es una empresa
        Email.sendEmail(user.email, "Login Empresa", {
          type: "Enterprise",
          nameFile: "activate.html",
          token: user.activationToken,
        });
      } else
        Email.sendEmail(user.email, "Login usuario Normal", {
          type: "Normal",
          nameFile: "activate.html",
          token: user.activationToken,
        });

      return res
        .status(200)
        .send(helper.generateLiteralObject(this.#response, RESPONSE));
    } catch (error) {
      this.#valuesError[2] = (error instanceof Exception) ? error.message: this.#valuesError[2]; 
      
      res.status((error instanceof Exception) ? 400 : 500).send(helper.generateLiteralObject(this.#response, this.#valuesError));
    }
  };

  userLoginValidate = async (req, res) => {
    try {
      if (
        !req.body.userIdentification ||
        !req.body.password ||
        req.body.userIdentification === "" ||
        req.body.password === ""
      )
        throw new Exception(
          "No existe el nombre del usuario o la contraseña no se ha enviado",
        );
      //Si existe sacamos las variables: */
      const userIdentification = req.body.userIdentification;
      const passLogin = req.body.password;
      //comrpobamos que el usuario exista.
      const USERNAMEEXIST = await this.#userService.getUserBy(
        "username",
        userIdentification,
      );

      const EMAILEXIST = await this.#userService.getUserBy(
        "email",
        userIdentification,
      );

      if (USERNAMEEXIST.length === 0 && EMAILEXIST.length === 0) {
        return res
          .status(401)
          .send(
            helper.generateLiteralObject(this.#response, [
              false,
              { exists: false },
              "El usuario no existe.",
            ]),
          );
      }
      const { user_id, username, password, email, profile_img, is_active } =
        USERNAMEEXIST.length > 0 ? USERNAMEEXIST[0] : EMAILEXIST[0];

      //Primero comprorameos que esté logeado: Sino saltará un error indicando que no pudeo hacer login:
      if (is_active === 0)
        throw new Exception(
          "No se puede hacer login ya que no has activado la cuenta. ",
        );
      //Teniendo el response haremos primero una comprobación con el password:

      const esValido = true; //bcrypt.compareSync(passLogin, password);
      if (esValido) {
        //Generamos un token único con esos datos:
        const accessToken = jwt.sign(
          //Almacenamos los datos en el token:
          {
            id: user_id,
            username: username,
            profile_img: profile_img,
          },
          process.env.JWT_ACCESS_SECRET, //Con esto firmamos nuestro token que es nuestra.
          { expiresIn: "15m" }, //Configuración del token
        );
        //Este token se utilizará para volver a pedir un accesstoken
        const refreshToken = jwt.sign(
          //Almacenamos los datos en el token:
          {
            id: user_id,
          },
          process.env.JWT_ACCESS_SECRET,
          { expiresIn: "30d" },
        );
        return res
          .status(200)
          .send(
            helper.generateLiteralObject(this.#response, [
              true,
              {
                isValid: esValido,
                accessToken: accessToken,
                refreshToken: refreshToken,
              },
              "",
            ]),
          );
      }
      return res
        .status(400)
        .send(
          helper.generateLiteralObject(this.#response, [
            false,
            { exits: false },
            "La contraseña no es válida",
          ]),
        );
    } catch (error) {
      this.#valuesError[2] = (error instanceof Exception) ? error.message: this.#valuesError[2]; 
      
      res.status((error instanceof Exception) ? 400 : 500).send(helper.generateLiteralObject(this.#response, this.#valuesError));
    }
  };

  //!Cambiar la impmentacion no veo ogico enviar una redireccion mejor falase o true
  activateUser = async (req, res) => {
    try {
      // Sacamos el token de localhost:3000/user/userActivation?token=d25f7...
      const { token } = req.query;

      if (!token) throw new Exception("No existe el token enviado");

      // Llamamos a nuestro servicio de base de datos
      const isValidActivation =
        await this.#userService.activateUserAccount(token);

      if (isValidActivation === true) {
        return res.redirect("http://localhost:80/login?activated=true");
      } else {
        return res.redirect("http://localhost:80/login?activated=false");
      }
    } catch (error) {
      this.#valuesError[2] = (error instanceof Exception) ? error.message: this.#valuesError[2]; 
      
      res.status((error instanceof Exception) ? 400 : 500).send(helper.generateLiteralObject(this.#response, this.#valuesError));
    }
  };

  iAmFollow = async (req, res) => {
    try {
      if (!req.header("usernameNow"))
        throw new Exception("No tenemos al usuario");
      const token = jwt.decode(req.header("accessToken"));

      if (req.header("usernameNow") === token["username"])
        throw new Exception("No puedes seguirte a ti mismo");

      const RESPONSEDATAUSER = await this.#userService.getUserBy(
        "username",
        req.header("usernameNow"),
      );

      if (RESPONSEDATAUSER.length === 0)
        throw new Exception("No existe ese usuario");

      const RESPONSEFOLLOW = await this.#userService.iAmFollower([
        token["id"],
        RESPONSEDATAUSER[0]["user_id"],
      ]);

      if (!RESPONSEFOLLOW) throw new Error("Hubo un error critico");

      return res.status(200).send(RESPONSEFOLLOW.length === 1);
    } catch (error) {
      this.#valuesError[2] = (error instanceof Exception) ? error.message: this.#valuesError[2]; 
      
      res.status((error instanceof Exception) ? 400 : 500).send(helper.generateLiteralObject(this.#response, this.#valuesError));
    }
  };

  iWantFollower = async (req, res) => {
    try {
      if (!req.header("usernameNow"))
        throw new Exception("No tenemos al usuario");
      const token = jwt.decode(req.header("accessToken"));
      if (req.header("usernameNow") === token["username"])
        throw new Exception("No puedes seguirte a ti mismo");

      const RESPONSEDATAUSER = await this.#userService.getUserBy(
        "username",
        req.header("usernameNow"),
      );

      if (RESPONSEDATAUSER.length === 0)
        throw new Exception("No existe ese usuario");

      const RESPONSEFOLLOW = await this.#userService.iAmFollower([
        token["id"],
        RESPONSEDATAUSER[0]["user_id"],
      ]);

      if (!RESPONSEFOLLOW) throw new Error("Hubo un error critico");

      if (RESPONSEFOLLOW.length === 1) {
        const RESPONSEDELFOLLOW = await this.#userService.deleteFollow([
          token["id"],
          RESPONSEDATAUSER[0]["user_id"],
        ]);

        if (RESPONSEDELFOLLOW["affectedRows"] === 0)
          throw new Error("Problema a insertar el follow");
        return res.status(200).send(false);
      } else {
        const RESPONSESETFOLLOW = await this.#userService.insertFollow([
          token["id"],
          RESPONSEDATAUSER[0]["user_id"],
        ]);
        if (RESPONSESETFOLLOW["affectedRows"] === 0)
          throw new Error("Problema a eliminar el follow");

        return res.status(200).send(true);
      }
   } catch (error) {
      this.#valuesError[2] = (error instanceof Exception) ? error.message: this.#valuesError[2]; 
      
      res.status((error instanceof Exception) ? 400 : 500).send(helper.generateLiteralObject(this.#response, this.#valuesError));
    }
  };

  deleteUser = async (req, res) => {
    try {
      const token = jwt.decode(req.header("accessToken"));
      const id = token["id"];
      UploadServices.deleteUserFolder(token['username']);
      const RESPONSE = await this.#userService.deleteUser(id);
      if (!RESPONSE) throw new Error();
      
     res.status(RESPONSE.affectedRows === 0 ? 400 : 200).send(helper.generateLiteralObject(RESPONSE.affectedRows !== 0))

    } catch (error) {
      this.#valuesError[2] = (error instanceof Exception) ? error.message: this.#valuesError[2]; 
      
      res.status((error instanceof Exception) ? 400 : 500).send(helper.generateLiteralObject(this.#response, this.#valuesError));
    }
  };
}
