import PostService from "../services/post.services.js";
import jwt from "jsonwebtoken";
import Helper from "../utils/helpers.js";
import Exception from "../utils/exceptions.js";
import UserService from "../services/user.services.js";
import UploadServices from "../core/middleware/upload.services.js";
import pool from "../core/config/database/db.js";
import { resolveNaptr } from "dns";
import { time } from "console";

const helper = new Helper();
export default class PostController {
  #postService = new PostService();
  #userService = new UserService();
  //* Estructura por defecto de una respuesta
  #response = {
    Success: null,
    Data: null,
    Error: null,
  };
  //* Valores por defecto si se detecta un error.
  #valuesError = [false, {}, "Hubo un error inesperado"];

  getDataInfo = async (req, res) => {
    try {
      const token = jwt.decode(req.header("accessToken"));
      if (!req.header("usernameNow")) throw new Exception("Faltan parámetros");

      let id =
        req.header("usernameNow") === token["username"] ? token["id"] : "";

      if (id === "") {
        const user = await this.#userService.getUserBy(
          "username",
          req.header("usernameNow"),
        );
        if (user === null || user === undefined || user.length === 0)
          throw new Exception("No existe el usuario");
        id = user[0]["user_id"];
      }

      const RESPONSE = await this.#postService.getDataRelativeWithPost([
        token["id"],
        id,
      ]);

      const RESPONSEMAPJSON = RESPONSE.map((post) => {
        let parseRaw =
          typeof post.Data === "string" ? JSON.parse(post.Data) : post.Data;
        parseRaw.userLike = Boolean(Number(parseRaw.userLike));
        return parseRaw;
      });
      const result = helper.generateLiteralObject(this.#response, [
        true,
        RESPONSEMAPJSON,
        "",
      ]);
      res.status(200).send(result);
    } catch (error) {
      console.log(error);
      res.status(500).send({ Success: false, Error: error.message });
    }
  };

  insertLike = async (req, res) => {
    try {
      const decoded = jwt.decode(req.header("accessToken"));
      if (!decoded || !decoded.id)
        throw new Exception("Token inválido o no proporcionado");
      const id = decoded.id;
      const RESPONSE = await this.#postService.insertLike(
        req.header("post_id"),
        id,
      );
      if (RESPONSE.affectedRows === 1)
        return res
          .status(201)
          .send(helper.generateLiteralObject(this.#response, [true, {}, ""]));
    } catch (error) {
      if (error instanceof Exception) {
        this.#valuesError[2] = error.message;
        return res
          .status(401)
          .send(
            helper.generateLiteralObject(this.#response, this.#valuesError),
          );
      }

      this.#valuesError[2] = error.message;
      return res
        .status(500)
        .send(helper.generateLiteralObject(this.#response, this.#valuesError));
    }
  };

  deleteLike = async (req, res) => {
    try {
      const decoded = jwt.decode(req.header("accessToken"));
      if (!decoded || !decoded.id)
        throw new Exception("Token inválido o no proporcionado");
      const id = decoded.id;

      const RESPONSE = await this.#postService.deleteLike(
        req.header("post_id"),
        id,
      );
      if (RESPONSE.affectedRows === 1)
        return res
          .status(201)
          .send(helper.generateLiteralObject(this.#response, [true, {}, ""]));
    } catch (error) {
      if (error instanceof Exception) {
        this.#valuesError[2] = error.message;
        return res
          .status(401)
          .send(
            helper.generateLiteralObject(this.#response, this.#valuesError),
          );
      }

      this.#valuesError[2] = error.message;
      return res
        .status(500)
        .send(helper.generateLiteralObject(this.#response, this.#valuesError));
    }
  };

  addPost = async (req, res) => {
    try {
      if (req.body.title.length > 50 || req.body.description_post.length > 200)
        throw new Exception("El título o la descripción son muy largos");

      const decoded = jwt.decode(req.header("accessToken"));
      if (!decoded || !decoded.id)
        throw new Exception("Token inválido o no proporcionado");
      const user_id = decoded.id;

      const imgPath = UploadServices.getRelativePath(req.file.path);

      const result = await this.#postService.insertPost(
        user_id,
        req.body.title,
        imgPath,
        req.body.description_post,
      );

      if (result.affectedRows === 1) {
        return res
          .status(201)
          .send(helper.generateLiteralObject(this.#response, [true, {}, ""]));
      } else {
        throw new Exception("Error al crear el post en la base de datos");
      }
    } catch (error) {
      if (req.file && req.file.path) {
        UploadServices.deleteImageByPath(req.file.path);
      }

      if (error instanceof Exception) {
        this.#valuesError[2] = error.message;
        return res
          .status(400)
          .send(
            helper.generateLiteralObject(this.#response, this.#valuesError),
          );
      }

      this.#valuesError[2] = error.message;
      return res
        .status(500)
        .send(helper.generateLiteralObject(this.#response, this.#valuesError));
    }
  };

  deletePost = async (req, res) => {
    try {
      const username = req.header("username") ?? "";
      const post_id = req.header("post_id") ?? "";
      const usernameNow = req.header("usernameNow") ?? "";
      const user_id = jwt.decode(req.header("accessToken"))["id"];
      if (username !== usernameNow)
        throw new Exception(
          "Si no es el usuario no puede eliminar la publicación",
        );
      if ([username, post_id, usernameNow].includes(""))
        throw new Exception("Faltan parámetros");

      const RESPONSEPOST = await this.#postService.getDataPost(post_id);
      UploadServices.deleteImageByPath(RESPONSEPOST[0]["img_post"]);

      const RESPONSE = await this.#postService.deletePost(post_id, user_id);
      if (RESPONSE.affectedRows === 0)
        throw Error("Hubo un problema inesperado");

      return res
        .status(200)
        .send(helper.generateLiteralObject(this.#response, [true, {}, ""]));
    } catch (error) {
      this.#valuesError[2] = error.message;
      if (error instanceof Exception)
        res
          .status(400)
          .send(
            helper.generateLiteralObject(this.#response, this.#valuesError),
          );
      res
        .status(500)
        .send(helper.generateLiteralObject(this.#response, this.#valuesError));
    }
  };

  insertComment = async (req, res) => {
    try {
      const token = jwt.decode(req.header("accessToken"));

      const userId = token.id;
      const message = req.header("message");
      const postId = req.header("idPost");

      const RESPONSE = await pool.query(
        `INSERT INTO comment (user_id, message, post_id) VALUES (?, ?, ?)`,
        [userId, message, postId],
      );

      res.json({ success: true, data: RESPONSE[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error inserting comment" });
    }
  };

  getComment = async (req, res) => {
    console.log(req.header("idPost"));
    const RESPONSE = await pool.query(
      `SELECT c.comment_id, c.message, u.username, u.profile_img FROM comment c inner join user u on u.user_id = c.user_id  where post_id = ?  order by c.created_at DESC`,
      req.header("idPost"),
    );
    console.log(RESPONSE[0]);
    res
      .status(200)
      .send(
        helper.generateLiteralObject(this.#response, [true, RESPONSE[0], ""]),
      );
  };

  deleteComment = async (req, res) => {
    try {
      const idComment = req.header("idComment");
      await pool.query(`DELETE FROM comment WHERE comment_id = ?`, [idComment]);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Error deleting comment" });
    }
  };

  updatePost = async (req, res) => {
    try {
      const { title, description } = req.body;
      const post_id = req.header("post_id");
      const decoded = jwt.decode(req.header("accessToken"));

      if (!decoded || !decoded.id) throw new Exception("Token inválido");
      if (!post_id) throw new Exception("Falta el ID de la publicación");
      if (title.length > 50 || description.length > 200) throw new Exception("Título o descripción demasiado largos");

      const result = await this.#postService.updatePost(post_id, decoded.id, title, description);

      if (result.affectedRows === 1) {
        return res.status(200).send(helper.generateLiteralObject(this.#response, [true, {}, ""]));
      } else {
        throw new Exception("No se pudo actualizar la publicación o no tienes permisos");
      }
    } catch (error) {
      this.#valuesError[2] = error.message;
      return res.status(error instanceof Exception ? 400 : 500).send(helper.generateLiteralObject(this.#response, this.#valuesError));
    }
  };
}
