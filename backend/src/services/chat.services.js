import pool from "../core/config/database/db.js";
import Exception from "../utils/exceptions.js";

export default class ChatService {

    #nametable = "chat";
    #namesField = "chat_id, user_1, user_2";


    async comprobateChat(userIds){
        const RESPONSE = await pool.query(`select * from chat where user_1 = ? and user_2 = ?`, userIds); 
        return RESPONSE[0]
    }
    
    async insertChat(userIds){
        const RESPONSE = await pool.query('insert into chat(user_1, user_2) values(?,?)', userIds);  
        return RESPONSE[0]
    }



}