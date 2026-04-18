import pool from "../core/config/database/db.js";
import Exception from "../utils/exceptions.js";
/**
 * @description Clase de los usuarios pra administrar los datos recibidos de la capa superior para hacer consultas
 * sql y devolver los datos obtenidos a la capa superior.
 */
//! Implementar el destructuring en las consulta MEJOR LEGIBILIDAD

export default class UserService {
  #nametable = "user";
  #namesField =
    "first_name, surnames, username, password, email, profile_img, is_active, temporalTokenActivaction";

  /**
   * *Método que nos permite hacer una consulta para obtener todos los datos o uno específico según un campo y su valor.
   * @param {string} field //* Variable donde haremos referencia a la columna de la tabla.
   * @param {string} value //* Variable donde haremos referencia al valor que tiene que tener la columna dentro de un where
   * @param {boolean} iWantAll //* variable para indicar si queremos recibir todo o un campo específico.
   * @returns
   */
  async getUserBy(field, value, iWantAll = true) {
    try {
      const selection = iWantAll ? "*" : `${field}`;
      const result = await pool.query(
        `SELECT ${selection} FROM ${this.#nametable} where ${field} = ?`,
        value,
      );
      return result[0];
    } catch (error) {
      console.log(
        "Se ha detectado un error devolveremos null, el error es el siguiente: " +
          error.message,
      );
      return null;
    }
  }
  /**
   * Método que nos permitira insertar un nuevo usuario en la tabla User pero además comprobará que ese usuario ya esté registrado.
   * @param {User} user Objeto literal, normalmente instanciado de la clase User para mantener una lócia estructural.
   * @returns {null | [true, {exists:true, email:user.email}, ""]} Null si faalla algo o hay un usuario o un response para responder la consulta de la capa superior.
   */

  async insertUser(user) {
    try {
      //Generamos los datos necesarios en formato array
      const DATAUSER = [
        user.firstName,
        user.surnames,
        user.username,
        user.password,
        user.email,
        user.profile_img,
        0,
        user.activationToken,
      ]; //Mapeamos el null
      const RESULTUSER = await pool.query(
        `INSERT INTO ${this.#nametable}(${this.#namesField}) values(?,?,?,?,?,?,?,?) RETURNING user_id`,
        DATAUSER,
      );
      if (!RESULTUSER) throw new Error("Hubo un error inesperado");
      console.log("Este es el resultado de la inserción de user ");
      if (user.iAmEnterprise === 0)
        //Significa que es una empresa
        await pool.query(
          `INSERT INTO user_enterprise(user_id) values(?)`,
          RESULTUSER[0][0].user_id,
        );

      //Todo Implementar una clase por cada tabla y una clase que ejecute dichas querys.
      //Luego registramos la accion:
      //await pool.query("INSERT INTO user_activity()");
      //Si todo está correcto le indicaremos que true y le devolveremos el gmail para el login su campo se autocomplete.
      return [
        true,
        {
          exists: true,
          email: user.email,
          iAmEnterprise: user.iAmEnterprise === 0,
        },
        "",
      ];
    } catch (error) {
      //Aquí podemos moldear un poco que hacemos segun que tipo de error tengamos.
      if (error instanceof Exception) {
        console.log(
          "Se ha detectado un usuario ya registrado con esa información se devolverá el siguiente mensaje: " +
            error.message,
        );
        return [false, "", error.message];
      }
      //Determina un fallo en el sql error critico
      console.log(error);
      return null;
    }
  }

  /**
   * Busca y activa a un usuario utilizando su token de activación temporal.
   * @param {string} token - El token UUID devuelto por el query param
   */
  async activateUserAccount(token) {
    try {
      // Buscamos si existe alguien con este token; si no devolvemos false directamente
      const USER = await this.getUserBy("temporalTokenActivaction", token);
      if (USER.length === 0) return false;

      // Le inyectamos los nuevos valores: activo = 1 y vaciamos el token
      await pool.query(
        `UPDATE ${this.#nametable} SET is_active = 1, temporalTokenActivaction = null WHERE temporalTokenActivaction = ?`,
        [token],
      );

      return true;
    } catch (error) {
      console.log("Error activando usuario: " + error.message);
      return null;
    }
  }

  /**
   * Función asyncrona con el cual recibiremos datos de los usuarios que siga el usuario  con sus pos
   * @param {string} id - ID del usuario;
   */
   /*TODO - Imlpementar offaset y que además sehan actuales de ese dia o del dia anterior al dia actual */

  async getUserFollowedDataAndPost(ids){
    const response = await pool.query(
      `Select 
          JSON_OBJECT(
            'post_id', p.post_id,
            'title', p.title, 
            'img_post', p.img_post,
            'description', p.description_post, 
            'created_at', p.created_at,
            'user_id', u.user_id, 
            'username', u.username,
            'profile_img', u.profile_img,
            'likes',(select count(*) from \`like\` where post_id = p.post_id), 
            'comment', (select count(*) from comment where post_id = p.post_id),
            'shared',(select count(*) from shared where post_id = p.post_id), 
            'userLike', (exists (select  1  from \`like\` where user_id = ? and post_id = p.post_id))
          ) 
        AS postInfo from user u inner join follow  f on followed_id = u.user_id inner join post p on p.user_id = f.followed_id  where f.follower_id = ?`, ids);
   return response[0];
  }

  async getListUsers(id){
    const response = await pool.query(
      `select username, profile_img from user where user_id != ?`, id);
   return response[0];
  }

  /**
   * Obtener a todos los seguidos del usuario
   * @param {string[]} dataYouWant Array con todos los campos que necesites.
   * @param {string} id  -ID del usuario el cual es el seguidor
   */
  async getDataFollowed(dataYouWant, id){
    let textFiedsNeed = dataYouWant.join(',');
  
    const followed = await pool.query(`SELECT ${textFiedsNeed} FROM user u join follow f  ON u.user_id = f.followed_id WHERE f.follower_id = ?`, id );
    return followed[0];
  }
  

  /**
   * Obtiene el número de seguidores del usuario.
   * @param {string} id - ID del usuario.
   * @returns {Promise<number|null>}
   */
  async getNumberFollower(id) {
    try {
      const result = await pool.query(
        `SELECT count(*) as TOTAL FROM user u join follow f ON u.user_id = f.follower_id WHERE f.followed_id = ?`,
        id,
      );
      return result[0][0].TOTAL;
    } catch (error) {
      console.log("Error en getNumberFollower: " + error.message);
      return null;
    }
  }

  async getNumberFollowed(id) {
    try {
      const result = await pool.query(
        `SELECT count(*) as TOTAL FROM user u join follow f ON u.user_id = f.followed_id WHERE f.follower_id = ?`,
        id,
      );
      return result[0][0].TOTAL;
    } catch (error) {
      console.log("Error en getNumberFollower: " + error.message);
      return null;
    }
  }

  /**
   * Obtiene el número de publicaciones del usuario.
   * @param {string} id - ID del usuario.
   * @returns {Promise<number|null>}
   */
  async getNumberPosts(id) {
    try {
      const result = await pool.query(
        `SELECT count(*) as TOTAL FROM post where user_id = ?`,
        id,
      );
      return result[0][0].TOTAL;
    } catch (error) {
      console.log("Error en getNumberPosts: " + error.message);
      return null;
    }
  }


  /**
   * Obtener a todos las publicaciones de los usuario a los cuales indiquemos
   * @param {string} id  -ID del usuario el cual es el seguidor
   */
  async getDataPublishFromUser(id){
  
    const publishs = await pool.query(`SELECT  title, description_post, created_at from post where user_id = ?`, id );
    return publishs[0];
  }


  /**
   * Obtiene los campos indicados de todas las publicaciones de un usuario.
   * @param {string[]} fields - Campos de la tabla post que se quieren recuperar.
   * @param {string} id - ID del usuario propietario de las publicaciones.
   * @returns {Promise<object[]|null>}
   */
  async getAllPostUser(fields, id) {
    try {
      if (!fields || fields.length === 0) throw new Error("Debes indicar al menos un campo");
      const textFieldsNeed = fields.join(',');
      const result = await pool.query(
        `SELECT ${textFieldsNeed} FROM post WHERE user_id = ?`,
        id,
      );
      return result[0];
    } catch (error) {
      console.log("Error en getAllPostUser: " + error.message);
      return null;
    }
  }


  async updateValuesUser(dataUser) {
    try {
      const RESPONSE = await pool.query(`update ${this.#nametable} set first_name = ?, surnames = ?, description_user = ? where user_id = ?`, dataUser);
      return RESPONSE[0]; 
    } catch (error) {
      return null;
    }
  }

  async updateImgsUser(dataUser) {
    try {
      const RESPONSE = await pool.query(`update ${this.#nametable} set profile_img = ? where user_id = ?`, dataUser);
      return RESPONSE[0]; 
    } catch (error) {
      return null;
    }
  }

  async iAmFollower(dataUser) {
    try {
      const RESPONSE = await pool.query(`select * from follow where follower_id = ? AND followed_id = ?`, dataUser);
      return RESPONSE[0]; 
    } catch (error) {
      return null;
    }
  }

  async insertFollow(dataUser) {
    try {
      const [result] = await pool.query(
        'INSERT INTO follow (follower_id, followed_id) VALUES (?, ?)',
        dataUser
      );

      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

async deleteFollow(dataUser) {
    try {
      const [result] = await pool.query(
        'DELETE FROM follow WHERE follower_id = ? AND followed_id = ?',
        dataUser
      );

      console.log(result);
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

