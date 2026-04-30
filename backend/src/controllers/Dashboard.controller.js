/**
 * Dashboard controller es un controllador que se encargará de abministrar unicamente
 * información general del usuario. Nada de funcionalidad simplemente información funcional
 * de la plataforma, ejemplo numero de seguidores, publicaciones de los seguidos, etc.
 */

import UserService from "../services/user.services.js";
import pool from "../core/config/database/db.js";
import jwt from "jsonwebtoken";
import Helper from "../utils/helpers.js";
const helper = new Helper();

export default class DashboardController {
  #userService = new UserService();
  #dataIcanGet = ['user_id', 'username', 'profile_img'];

  //!Caso ideal recibo el objeto literal del fonrtend tener que validar el token además de enviar desde el frontend.
  getAllDataUser = async (req, res) => {
    try {
      const id = jwt.decode(req.header('accessToken')).id;    
      const ResponseRawPostsByUser = await this.#userService.getUserFollowedDataAndPost([id, id]);
     
      if (!ResponseRawPostsByUser) {
        return res.status(200).send({ dataNewPost: [] });
      }

      const responseJson = {
        dataNewPost: ResponseRawPostsByUser.map(item => {
          let parseRaw = JSON.parse(item.postInfo);
          parseRaw.likes = Number(parseRaw.likes);
          parseRaw.comment = Number(parseRaw.comment);
          parseRaw.shared = Number(parseRaw.shared);
          parseRaw.userLike = Boolean(Number(parseRaw.userLike));
          return parseRaw;
        })
      };
      responseJson.dataNewPost = helper.shuffleArray(responseJson.dataNewPost);
      return res.status(200).send(responseJson);
    } catch (error) {
      console.error("Error in getAllDataUser:", error);
      return res.status(500).send({ Success: false, Error: "Error al obtener datos del dashboard" });
    }
  };

  getNumberFollowed = async (req, res) => {
    const id = jwt.decode(req.header('accessToken')).id;    
    const RESPONSE = await this.#userService.getNumberFollowed(id);
    return res.status(201).send(RESPONSE);
  };
}
