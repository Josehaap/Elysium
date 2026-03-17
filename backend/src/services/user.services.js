import pool from '../database/db.js'; 

/**
 * @description Clase encargada de recibir losdatos del controllador y hacer la consulta sql. 
 */

//Todo implemetar logica recordar recigbe datos develñve dastos 
export default class UserService {
    
    #nametable = 'user';

    /**
     * 
     * @param {string} field 
     * @param {string} value 
     * @param {boolean} iWantAll 
     * @returns 
     */
    async getUserBy(field , value, iWantAll=true){
        try{
            const selection = iWantAll? "*": `${field}`;
            const result =  await pool.query(`SELECT ${selection} FROM ${this.#nametable} where ${field} = ?`, value);
            return result[0];
        } catch (error) {
            console.log("Se ha detectado un error devolveremos null, el error es el siguiente: "+ error.message)
            return null; 
        }
       
    }

    
}