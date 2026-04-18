import PostService from "../services/post.services.js";
import jwt from "jsonwebtoken";
import Helper from "../utils/helpers.js";
import Exception from "../utils/exceptions.js";
import UserService from "../services/user.services.js";

const helper = new Helper();
export default class PostController {
    #postService = new PostService();
    #userService  = new UserService();
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
                if (!req.header('usernameNow')) throw new Exception('Faltan parámetros');
          
                let id = req.header('usernameNow') === token['username'] ? token['id']:'';
                
                if (id === ''){
                  const user = await this.#userService.getUserBy('username', req.header('usernameNow'));
                  if (user === null || user === undefined ||user.length === 0 ) throw new Exception("No existe el usuario");
                  id = user[0]['user_id']; 
                }

                
            const RESPONSE = await this.#postService.getDataRelativeWithPost([token['id'],id]);
            
            const RESPONSEMAPJSON = RESPONSE.map(post => {
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