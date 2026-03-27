import UserService from "../services/user.services.js";
import Helper from "../utils/helpers.js";
import UserValidators from "../validators/UserValidators.js";
import User from "../model/User.js";
import Exception from "../utils/exceptions.js";
import bcrypt from "bcrypt";

const helper = new Helper();

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
          .send(helper.generateRespond(this.#response, this.#valuesError));
      //Si existe pero no hay nada respondemos la petición
      if (RESPONSE.length !== 0)
        return res
          .status(200)
          .send(
            helper.generateRespond(this.#response, [
              true,
              { exists: true },
              "",
            ]),
          );
      else
        return res
          .status(200)
          .send(
            helper.generateRespond(this.#response, [
              true,
              { exists: false },
              "",
            ]),
          );
    } catch (error) {
      //Modificamos el mensaje de error.
      this.#valuesError[2] = error.message;
      return res
        .status(400)
        .send(helper.generateRespond(this.#response, this.#valuesError));
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
      //Todo Implementar la logica de crear carpeta para guardar foto perfil.
      //Todo Implementar envio de gmail
      //Todo implementar comprobación de imagenes y videos que se han aptos.
      console.log("Este es el usuairo recibido: ");
      console.log(req.body);
      //Comprobamos las claves y luego los valores.
      UserValidators.validateKeys(req.body);
      UserValidators.validateValues(req.body);
      const data = req.body;
      //Si todo ha salido bien instanciamos al usuario
      console.log(data);
      let user = new User(data.username, data.email);
      user.firstName = data.first_name;
      //Esperamos que se codifiquen la contraseña.
      await user.setPassword(data.password);
      user.surnames = data.surnames;
      //Si el usuario ha dicho que es una empresa por defecto en la base de datos su cuenta estará desactividada.
      user.iAmEnterprise = data.iAmEnterprise ? 0 : 1;

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

      const RESPONSE = await this.#userService.insertUser(user);
      //Si recibimos null significa que ha sido un error critico del servidor.
      if (RESPONSE === null)
        return res
          .status(500)
          .send(helper.generateRespond(this.#response, this.#valuesError));
      //Encambio si recibimos false significa que el usuario ya está registrado
      if (!RESPONSE[0])
        return res
          .status(409)
          .send(helper.generateRespond(this.#response, RESPONSE));

      //Si todo está bien le informamos de que si existe
      return res
        .status(200)
        .send(helper.generateRespond(this.#response, RESPONSE));
    } catch (error) {
      console.log("He entrado aquí ");
      console.log(error.message);
      this.#valuesError[2] = error.message;
      res
        .status(400)
        .send(helper.generateRespond(this.#response, this.#valuesError));
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
            helper.generateRespond(this.#response, [
              false,
              { exists: false },
              "El usuario no existe.",
            ]),
          );
      }
      const { user_id, username, password, email, profile_img } =
        USERNAMEEXIST.length > 0 ? USERNAMEEXIST[0] : EMAILEXIST[0];
      //Teniendo el response haremos primero una comprobación con el password:

      const esValido = bcrypt.compareSync(passLogin, password);

      let dataResponds = {
        isValid: esValido,
        id: "",
        username: "",
        profile_img: "",
      };

      if (
        esValido
      ) //! Hacer el envio de dato recordar databsae unique hay que reiniciar.
      {
        dataResponds.id = user_id;
        dataResponds.username = username;
        dataResponds.profile_img = profile_img;
        return res
          .status(200)
          .send(
            helper.generateRespond(this.#response, [true, dataResponds, ""]),
          );
      } else
        return res
          .status(200)
          .send(
            helper.generateRespond(this.#response, [true, dataResponds, ""]),
          );
    } catch (error) {
      if (error instanceof Exception) {
        console.log("asd");
        this.#valuesError[2] = error.message;
        return res
          .status(401)
          .send(helper.generateRespond(this.#response, this.#valuesError));
      }

      return res
        .status(500)
        .send(helper.generateRespond(this.#response, this.#valuesError));
    }
  };
}
