/**
 * Middleware para validar y crear token. 
 */
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import Exception from "../../utils/exceptions.js";

dotenv.config(); 
export default class Token {
    static generateTokens(data, firma,config){
        return jwt.sign(data,firma,config)
    }

    /**
     * Función que servirá para validar el token que se deberá recibir 
     * por el header con un nombre específico llamado accessToken. 
     * Una vez recibida validaremos que sea correcto y pasaremos a la 
     * siguiente función sinó entonces mandaremos un mensaje de alerta. 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * @returns 
     */
    static validateToken(req, res, next){
        try {
            if (!req.header('accessToken')) throw new Exception('El usuario no tiene las claves');
            //jwt.verify(req.header('accessToken'),process.env.JWT_ACCESS_SECRET); 
            next();  
        } catch (error) {
            return res.status(401).send(error.message);
        }
    }

    
}