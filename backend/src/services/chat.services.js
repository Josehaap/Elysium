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

    async getChatsByUser(userId) {
        const RESPONSE = await pool.query(
            `SELECT 
                c.chat_id, 
                u.user_id as contact_id, 
                u.username as contact_username, 
                u.profile_img as contact_img
            FROM chat c
            JOIN user u ON (CASE WHEN c.user_1 = ? THEN c.user_2 ELSE c.user_1 END) = u.user_id
            WHERE c.user_1 = ? OR c.user_2 = ?`,
            [userId, userId, userId]
        );
        return RESPONSE[0];
    }
}