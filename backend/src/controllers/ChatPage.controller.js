import UserService from "../services/user.services.js";
import pool from "../core/config/database/db.js";
import Helper from "../utils/helpers.js";
import Exception from "../utils/exceptions.js";
import ChatService from "../services/chat.services.js";
import jwt from "jsonwebtoken";
const helper = new Helper(); 

export default class ChatController{
    #userService = new UserService(); 
    #chatService = new ChatService();

    //* Estructura por defecto de una respuesta
    #response = {
        Success: null,
        Data: null,
        Error: null,
    };

    //* Valores por defecto si se detecta un error.
    #valuesError = [false, {}, "Hubo un error inesperado"];
    async comrpobateUserAndReorded(users){
        let idUsers = []

        if (users.includes('') ) throw new Exception('Falta credenciales'); 
        for (const user of users) {
                const RESPONSE = await this.#userService.getUserBy('username', user);
                
                if (RESPONSE.length === 0) {
                    throw new Exception('No existe el usuario');
                }
                idUsers.push(RESPONSE[0].user_id); 
            }

            if (idUsers.length < 2) throw new Exception('No se encontró a los usuarios');

            const userIdOrdenMenorAMayor = idUsers.sort((a, b) => a - b);

            return userIdOrdenMenorAMayor
    }
    
    comprobateExist = async (req, res)=>{
        try {
            const usernameLoged = req.header('usernameLoged') ?? ''; 
            const usernameShow = req.header('usernameShow') ?? ''; 

            if (usernameLoged === usernameShow) throw new Exception('No puede ser el mismo usuario');

            const users = [usernameLoged, usernameShow];

            const userIdOrdenMenorAMayor = await this.comrpobateUserAndReorded(users); 

            const RESPONSE = await this.#chatService.comprobateChat(userIdOrdenMenorAMayor); 
            return res.status(200).send(helper.generateLiteralObject(this.#response, [true, RESPONSE.length > 0, ''])); 

        } catch (error) {

            this.#valuesError[2] = (error instanceof Exception) ? error.message: this.#valuesError[2]; 

            res.status((error instanceof Exception) ? 400 : 500).send(helper.generateLiteralObject(this.#response, this.#valuesError));
        }
    }
    createChat = async (req, res) => {
        try {

            const usernameLoged = req.header('usernameLoged') ?? ''; 
            const usernameShow = req.header('usernameShow') ?? ''; 

            if (usernameLoged === usernameShow) throw new Exception('No puede ser el mismo usuario');

            const users = [usernameLoged, usernameShow];
           
            const userIdOrdenMenorAMayor = await this.comrpobateUserAndReorded(users); 

          

            const RESPONSEEXIST = await  this.#chatService.comprobateChat(userIdOrdenMenorAMayor); 

            if (RESPONSEEXIST.length > 0) throw new Exception('Ya existe el chat');

            const RESPONSEINSERT = await  this.#chatService.insertChat(userIdOrdenMenorAMayor);
            if (RESPONSEINSERT.affectedRows != 1) throw new Exception('Hubo un error');

            return res.status(200).send(helper.generateLiteralObject(this.#response, [true, {}, '']));

        } catch (error) {
            this.#valuesError[2] = (error instanceof Exception) ? error.message: this.#valuesError[2]; 

            res.status((error instanceof Exception) ? 400 : 500).send(helper.generateLiteralObject(this.#response, this.#valuesError));
        }
    }


    getChats = async (req, res) => {
        try {
            const token = jwt.decode(req.header('accessToken'));
            if (!token || !token.id) throw new Exception('Token inválido');
            const id = token.id;

            const RESPONSE = await pool.query(
                `SELECT c.chat_id,
                CASE 
                    WHEN c.user_1 = ? THEN c.user_2
                    ELSE c.user_1
                END AS other_user_id,
                (SELECT u.username FROM user u WHERE u.user_id = CASE WHEN c.user_1 = ? THEN c.user_2 ELSE c.user_1 END) AS other_username,
                (SELECT u.profile_img FROM user u WHERE u.user_id = CASE WHEN c.user_1 = ? THEN c.user_2 ELSE c.user_1 END) AS other_profile_img,
                (SELECT m.content FROM message m WHERE m.chat_id = c.chat_id ORDER BY m.sennt_at DESC LIMIT 1) AS last_message,
                (SELECT m.sennt_at FROM message m WHERE m.chat_id = c.chat_id ORDER BY m.sennt_at DESC LIMIT 1) AS last_message_at, 
                (SELECT m.user_send_id FROM message m WHERE m.chat_id = c.chat_id ORDER BY m.sennt_at DESC LIMIT 1) AS last_message_sender_id, 
                (SELECT COUNT(*) FROM message m WHERE m.chat_id = c.chat_id AND m.user_send_id != ? AND m.is_read = 0) AS unread_count
                FROM chat c 
                WHERE c.user_1 = ? OR c.user_2 = ?
                ORDER BY last_message_at DESC;`, 
                [id, id, id, id, id, id]
            );

            return res.status(200).send(helper.generateLiteralObject(this.#response, [true, RESPONSE[0], '']));

        } catch (error) {
            this.#valuesError[2] = (error instanceof Exception) ? error.message : "Error al obtener los chats";
            res.status((error instanceof Exception) ? 400 : 500).send(helper.generateLiteralObject(this.#response, this.#valuesError));
        }
    }

    getMessages = async (req, res) => {
        try {
            const chatId = req.header('chatId');
            if (!chatId) throw new Exception('Falta el ID del chat');

            const RESPONSE = await pool.query(
                `SELECT message_id, content, user_send_id, post_id, sennt_at, is_read 
                FROM message 
                WHERE chat_id = ? 
                ORDER BY sennt_at ASC`,
                [chatId]
            );

            return res.status(200).send(helper.generateLiteralObject(this.#response, [true, RESPONSE[0], '']));

        } catch (error) {
            this.#valuesError[2] = (error instanceof Exception) ? error.message : "Error al obtener los mensajes";
            res.status((error instanceof Exception) ? 400 : 500).send(helper.generateLiteralObject(this.#response, this.#valuesError));
        }
    }

}