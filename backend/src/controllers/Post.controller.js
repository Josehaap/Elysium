import PostService from "../services/post.services.js";
import jwt from "jsonwebtoken";
import Helper from "../utils/helpers.js";
import Exception from "../utils/exceptions.js";

const helper = new Helper();
export default class PostController {
    #postService = new PostService();
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
            const decoded = jwt.decode(req.header('accessToken'));
            if (!decoded || !decoded.id) throw new Exception("Token inválido o no proporcionado");
            
            const id = decoded.id;
            const RESPONSE = await this.#postService.getDataRelativeWithPost(id);
            const RESPONSEMAPJSON = RESPONSE.map(post => {
                // MySQL puede devolver el JSON_OBJECT ya como objeto o como string dependiendo de la versión
                let parseRaw = (typeof post.Data === 'string') ? JSON.parse(post.Data) : post.Data;
                parseRaw.userLike = Boolean(Number(parseRaw.userLike));
                return parseRaw;
            });
            const result = helper.generateLiteralObject(this.#response, [true, RESPONSEMAPJSON, '']);
            res.status(200).send(result);
        } catch (error) {
            console.error(error);
            res.status(500).send({ Success: false, Error: error.message });
        }
    }


    insertLike = async (req, res)=>{
        try {
            const decoded = jwt.decode(req.header('accessToken'));
            if (!decoded || !decoded.id) throw new Exception("Token inválido o no proporcionado");
            const id = decoded.id;
            const RESPONSE = await this.#postService.insertLike(req.header('post_id'), id);
            if (RESPONSE.affectedRows === 1)return res.status(201).send(helper.generateLiteralObject(this.#response, [true, {}, '']));

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
    }

    deleteLike = async (req, res)=>{
        try {
            const decoded = jwt.decode(req.header('accessToken'));
            if (!decoded || !decoded.id) throw new Exception("Token inválido o no proporcionado");
            const id = decoded.id;
            console.log('he entrado')
            const RESPONSE = await this.#postService.deleteLike(req.header('post_id'), id);
            if (RESPONSE.affectedRows === 1)return res.status(201).send(helper.generateLiteralObject(this.#response, [true, {}, '']));

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
    }
}