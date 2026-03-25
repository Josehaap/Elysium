import pool from '../database/db.js'; 
import Exception from '../utils/exceptions.js';
import UserValidators from '../validators/UserValidators.js';
/**
 * @description Clase de los usuarios pra administrar los datos recibidos de la capa superior para hacer consultas
 * sql y devolver los datos obtenidos a la capa superior. 
 */


export default class UserService {
    
    #nametable = 'user';
    #namesField = "first_name, surnames, username, password, email, profile_img";

    /**
     * *Método que nos permite hacer una consulta para obtener todos los datos o uno específico según un campo y su valor. 
     * @param {string} field //* Variable donde haremos referencia a la columna de la tabla. 
     * @param {string} value //* Variable donde haremos referencia al valor que tiene que tener la columna dentro de un where
     * @param {boolean} iWantAll //* variable para indicar si queremos recibir todo o un campo específico. 
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
    /**
     * Método que nos permitira insertar un nuevo usuario en la tabla User pero además comprobará que ese usuario ya esté registrado. 
     * @param {User} user Objeto literal, normalmente instanciado de la clase User para mantener una lócia estructural. 
     * @returns {null | [true, {exists:true, email:user.email}, ""]} Null si faalla algo o hay un usuario o un response para responder la consulta de la capa superior. 
     */
    //!Quitar estas comprobaciones de getUserBy y pasarlas al controller 
    async insertUser(user){
        try {
            const DATAUSER = [user.firstName, user.surnames, user.username, user.password, user.email, ""]; 
            //console.log(DATAUSER);
            const USERNAMEEXIST = await this.getUserBy('username', user.username);
            if ( USERNAMEEXIST && USERNAMEEXIST.length > 0) throw new Exception("Ya existe el nombre de la cuenta de usuario");
            //Comprobamos el email
            const EMAILEXIST = await this.getUserBy('email', user.email);
            if (EMAILEXIST && EMAILEXIST.length > 0) throw new Exception("Ya existe el email del usuario");

            const RESULT = await pool.query(`INSERT INTO ${this.#nametable}(${this.#namesField}) values(?,?,?,?,?,?)`, DATAUSER);
            
            if (!RESULT) throw new Error("Hubo un error inesperado");

            //Si todo está correcto le indicaremos que true y le devolveremos el gmail para el login su campo se autocomplete. 
            return [true, {exists:true, email: user.email}, ""];
            
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