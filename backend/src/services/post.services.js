import { resolveNaptr } from "dns";
import pool from "../core/config/database/db.js";
import Exception from "../utils/exceptions.js";

export default class PostService {
  #nametable = "post";
  #namesField =
    "post_id, user_id, title , img_post , description_post, created_at";

  /**
   *
   * @param {*} ids array que recibie el id del suario logueado y el id sobrela informacion que se quiera scar de cierto usuairo
   * @returns
   */
  async getDataPost(id) {
    const RESPONSESHARED = await pool.query(
      "SELECT * from post where post_id = ?",
      id,
    );

    return RESPONSESHARED[0];
  }
  async getDataRelativeWithPost(id) {
    const RESPONSESHARED = await pool.query(
      "SELECT JSON_OBJECT ('id', p.post_id, 'title', title,'img', img_post,'description', description_post,'likes',(select count(*) from `like` where post_id = p.post_id), 'comment', (select count(*) from comment where post_id = p.post_id),'shared',(select count(*) from shared where post_id = p.post_id), 'userLike', (exists (select  1  from `like` where user_id = ? and post_id = p.post_id))) as Data  from post p where user_id = ? ORDER BY p.created_at DESC",
      id,
    );

    return RESPONSESHARED[0];
  }

  async insertLike(post_id, user_id) {
    const RESPONSE = await pool.query(
      "INSERT INTO `like` (user_id, post_id) VALUES (?, ?)",
      [user_id, post_id],
    );

    return RESPONSE[0];
  }

  async insertPost(user_id, title, img_post, description_post) {
    const RESPONSE = await pool.query(
      "INSERT INTO `post` (user_id, title, img_post, description_post) VALUES (?, ?, ?, ?)",
      [user_id, title, img_post, description_post],
    );
    return RESPONSE[0];
  }

  async deleteLike(post_id, user_id) {
    const RESPONSE = await pool.query(
      "DELETE from `like` where user_id =  ?  and  post_id = ?",
      [user_id, post_id],
    );
    return RESPONSE[0];
  }

  async deletePost(post_id, user_id) {
    const RESPONSE = await pool.query(
      "DELETE from `post` where user_id =  ?  and  post_id = ?",
      [user_id, post_id],
    );
    return RESPONSE[0];
  }

  async updatePost(post_id, user_id, title, description) {
    const RESPONSE = await pool.query(
      "UPDATE `post` SET title = ?, description_post = ? WHERE post_id = ? AND user_id = ?",
      [title, description, post_id, user_id]
    );
    return RESPONSE[0];
  }
}
