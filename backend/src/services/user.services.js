import pool from '../database/db.js'; 
import Exception from '../utils/exceptions.js';
/**
 * @description Clase encargada de recibir losdatos del controllador y hacer la consulta sql. 
 */

//Todo implementar la logica desde frontend recordar que cuando falla debería devolver un par de datos. 
export default class UserService {
    
    #nametable = 'user';
    #namesField = "first_name, surnames, username, password, email, profile_img"
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
    //!Quitar estas comprobaciones de getUserBy y pasarlas al controller 
    async insertUser(user){
        try {
            const DATAUSER = [user.firstName, user.surnames, user.username, user.password, user.email, ""]; 
            //console.log(DATAUSER);
            const USERNAMEEXIST = await this.getUserBy('username', user.username);
            if (USERNAMEEXIST.length > 0) throw new Exception("Ya existe el nombre de la cuenta de usuario");
            //Comprobamos el email
            const EMAILEXIST = await this.getUserBy('email', user.email);
            if (EMAILEXIST.length > 0) throw new Exception("Ya existe el email del usuario");

            const RESULT = await pool.query(`INSERT INTO ${this.#nametable}(${this.#namesField}) values(?,?,?,?,?,?)`, DATAUSER);
            
            if (!RESULT) throw new Error("Hubo un error inesperado");

            //Si todo está correcto le indicaremos que true y le devolveremos el gmail para el login su campo se autocomplete. 
            return [true, {exists:true, email: user.email}, ""]
        } catch (error) {
            //Aquí podemos moldear un poco que hacemos segun que tipo de error tengamos. 
            if (error instanceof Exception) {
                console.log("Se ha detectado un usuario ya registrado con esa información se devolverá el siguiente mensaje: " + error.message);
                return [false, "", error.message]; 
            }
            //Determina un fallo en el sql error critico
            return null; 
        } 
        
    }

    
}