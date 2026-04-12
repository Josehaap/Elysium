/**
 * @class ProfileController
 * @description Controlador para gestionar las rutas relacionadas con el perfil del usuario.
 * Actúa como puente entre la capa de rutas y la capa de servicios.
 * @author Jose de Haro Jiménez.
 */

import UserService from "../services/user.services.js";
import jwt from "jsonwebtoken";
import Helper from "../utils/helpers.js";
import Exception from "../utils/exceptions.js";

const helper = new Helper();

export default class ProfileController {
  #userService = new UserService();

  //* Estructura por defecto de una respuesta
  #response = {
    Success: null,
    Data: null,
    Error: null,
  };
  //* Valores por defecto si se detecta un error.
  #valuesError = [false, {}, "Hubo un error inesperado"];

  /**
   * Devuelve los post_id de todas las publicaciones del usuario autenticado.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  getAllPostUser = async (req, res) => {
    try {
      const decoded = jwt.decode(req.header("accessToken"));
      if (!decoded || !decoded.id) throw new Exception("Token inválido o no proporcionado");

      const id = decoded.id;
      const RESPONSE = await this.#userService.getAllPostUser(['post_id'], id);

      if (!RESPONSE) throw new Exception("No se pudieron obtener las publicaciones");

      return res
        .status(200)
        .send(helper.generateLiteralObject(this.#response, [true, RESPONSE, ""]));
    } catch (error) {
      if (error instanceof Exception) {
        this.#valuesError[2] = error.message;
        return res
          .status(401)
          .send(helper.generateLiteralObject(this.#response, this.#valuesError));
      }
      this.#valuesError[2] = error.message;
      return res
        .status(500)
        .send(helper.generateLiteralObject(this.#response, this.#valuesError));
    }
  };

  /**
   * Devuelve los datos del perfil del usuario autenticado:
   * nombre, descripción, seguidores y número de publicaciones.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  getAllDataUser = async (req, res) => {
    try {
      const decoded = jwt.decode(req.header("accessToken"));
      if (!decoded || !decoded.id) throw new Exception("Token inválido o no proporcionado");

      const id = decoded.id;

      const RESPONSEDATAUSER = await this.#userService.getUserBy('user_id', id);
      if (!RESPONSEDATAUSER || RESPONSEDATAUSER.length === 0)
        throw new Exception("No se encontró el usuario");

      const { username, description_user, first_name, surnames } = RESPONSEDATAUSER[0];

      const RESPONSENUMBERFOLLOWER = await this.#userService.getNumberFollower('1');
      const RESPONSENUMBERPOSTS = await this.#userService.getNumberPosts('1');

      const result = {
        username: username ?? "",
        description_user: description_user ?? "",
        name: `${first_name ?? ""} ${surnames ?? ""}`,
        numberFollower: RESPONSENUMBERFOLLOWER,
        numberPublication: RESPONSENUMBERPOSTS,
      };

      return res
        .status(200)
        .send(helper.generateLiteralObject(this.#response, [true, result, ""]));
    } catch (error) {
      if (error instanceof Exception) {
        this.#valuesError[2] = error.message;
        return res
          .status(401)
          .send(helper.generateLiteralObject(this.#response, this.#valuesError));
      }
      this.#valuesError[2] = error.message;
      return res
        .status(500)
        .send(helper.generateLiteralObject(this.#response, this.#valuesError));
    }
  };
}
