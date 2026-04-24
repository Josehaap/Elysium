import express from "express";
import Token from "../core/middleware/Token.js";
const router = express.Router(); //Generamos una instancia de las funcione de enrutamiento.
import pool from "../core/config/database/db.js";
import Exception from "../utils/exceptions.js";
import ChatController from "../controllers/ChatPAge.controller.js";
import jwt from "jsonwebtoken";

/**
 * @File - Archivo utilizado para administrar las rutas de usuarios.
 * @author Jose de Haro Jiménez.
 */

const chatController = new ChatController(); 
router.get("/exists" , Token.validateToken, chatController.comprobateExist); 

router.get("/getChats",Token.validateToken, async (req, res)=>{
    const token = jwt.decode(req.header('accessToken')); 
    const id = token['id']; 
    const RESPONSE = await pool.query(
        `SELECT c.chat_id,
        CASE 
            WHEN c.user_1 = ? THEN c.user_2
            ELSE c.user_1
        END AS other_user_id,

        (SELECT u.username 
        FROM user u 
        WHERE u.user_id = 
            CASE 
            WHEN c.user_1 = ? THEN c.user_2
            ELSE c.user_1
            END
        ) AS other_username,

        (SELECT u.profile_img  
        FROM user u 
        WHERE u.user_id = 
            CASE 
            WHEN c.user_1 = ? THEN c.user_2
            ELSE c.user_1
            END
        ) AS other_profile_img,

        (SELECT m.content  
        FROM message m  
        WHERE m.chat_id = c.chat_id  
        ORDER BY m.sennt_at DESC  
        LIMIT 1) AS last_message,

        (SELECT m.sennt_at  
        FROM message m  
        WHERE m.chat_id = c.chat_id  
        ORDER BY m.sennt_at DESC  
        LIMIT 1) AS last_message_at, 

        (SELECT m.user_send_id  
        FROM message m  
        WHERE m.chat_id = c.chat_id  
        ORDER BY m.sennt_at DESC  
        LIMIT 1) AS last_message_sender_id, 

        (SELECT COUNT(*)  
        FROM message m  
        WHERE m.chat_id = c.chat_id 
        AND m.user_send_id != ? 
        AND m.is_read = 0) AS unread_count

        FROM chat c 
        WHERE c.user_1 = ? OR c.user_2 = ?
        ORDER BY last_message_at DESC;`, [id, id, id, id, id, id]);

    res.status(200).send(RESPONSE[0]);
});

router.get("/messages" , Token.validateToken, chatController.getMessage); 


router.post("/insertChat",Token.validateToken, chatController.createChat);

export default router;