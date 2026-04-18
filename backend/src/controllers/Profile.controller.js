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
import UploadServices from "../core/middleware/upload.services.js";

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
      const token = jwt.decode(req.header("accessToken"));
      if (!req.header('usernameNow')) throw new Exception('Faltan parámetros');

      let id = req.header('usernameNow')=== token['username'] ? token['id']:'';
      
      if (id === ''){
        const user = await this.#userService.getUserBy('username', req.header('usernameNow'));
        id = user[0]['user_id']; 
      }
      const RESPONSEDATAUSER = await this.#userService.getUserBy('user_id', id);

      if (!RESPONSEDATAUSER || RESPONSEDATAUSER.length === 0) throw new Exception("No se encontró el usuario");

      const { username, description_user, first_name, surnames, profile_img, email } = RESPONSEDATAUSER[0];
      const RESPONSENUMBERFOLLOWER = await this.#userService.getNumberFollower(id);
      const RESPONSENUMBERPOSTS = await this.#userService.getNumberPosts(id);
      const RESPONSENUMBERFOLLOWED = await this.#userService.getNumberFollowed(id);

      const result = {
        username: username ?? "",
        description_user: description_user ?? "",
        name:first_name ?? '',
        surname: surnames ?? '',   
        urlImg : profile_img, 
        numberFollower: RESPONSENUMBERFOLLOWER,
        numberPublication: RESPONSENUMBERPOSTS,
        numberFollowed: RESPONSENUMBERFOLLOWED
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

  updateDataUser = async (req, res) =>{
    try {
      if (!req.header) throw new Exception('Se necesita más información');

      if (!req.header('usernameNow')) throw new Exception('Se necesita más información');


      const {id, username} =  jwt.decode(req.header('accessToken'));

      if (req.header('usernameNow') !== username) throw new Exception('No eres el usuario loguado no puedes modificar esa información');

      if (req.body.name === null || 
          req.body.surname === null || 
          (req.body.name ==='' && req.body.surname === '')) throw new Exception('Ambos valores no pueden estár vacio');
      
      const file = req.file ?? ''; 
      
      const rutaParaBaseDeDatos = file !== '' ? UploadServices.getRelativePath(file.path) : '';

      const RESPONSE = await this.#userService.updateValuesUser([req.body.name,req.body.surname,req.body.description_user,id]); 

      if (!RESPONSE ||  RESPONSE.affectedRows !== 1) throw new Exception('Hubo un problema a la hora de actualizar los datos. ')
        if (rutaParaBaseDeDatos !== '') {
          const RESPONSEUPDATEIMG = await this.#userService.updateImgsUser([rutaParaBaseDeDatos,id]); 
          if (!RESPONSEUPDATEIMG ||  RESPONSEUPDATEIMG.affectedRows !== 1) throw new Exception('Hubo un problema a la hora de actualizar los datos. ')
        }

      return res.status(200).send(helper.generateLiteralObject(this.#response,[true, {}, '']))
      
    } catch (error) {
      if (error instanceof Exception) return res.status(400).send(helper.generateLiteralObject(this.#response, this.#valuesError));
      return res.status(500).send(helper.generateLiteralObject(this.#response, this.#valuesError)); 
    }
  }
}
