import UserService from "../services/user.services.js";
import Helper from "../utils/helpers.js";
import jwt from "jsonwebtoken";

const helper = new Helper();

export default class SearchController{

    #userService= new UserService();
    
    //* Estructura por defecto de una respuesta

    #response = {
        Success: null,
        Data: null,
        Error: null,
    };

    //*Valores por defecto si se detecta un error.
    #valuesError = [false, {}, "Hubo un error inesperado"];

    /**
     *  Nos traeremos los datos de lo usuarios. que o seamos nosotros
     */
    getAllUser = async (req ,res)=>{
       
        try {
            let id = jwt.decode(req.header('accessToken'))['id'];

            const RESPONSEDATARAW = await this.#userService.getListUsers(id);

            let dataRespAleatorio = helper.shuffleArray(RESPONSEDATARAW);

            res.status(200).send(helper.generateLiteralObject(this.#response, [true, dataRespAleatorio, '']))
        } catch (error) {
            
            console.log(error.message

            )
        }
    }

}