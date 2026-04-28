import UserService from "../services/user.services.js";
import pool from "../core/config/database/db.js";
import Helper from "../utils/helpers.js";
import Exception from "../utils/exceptions.js";
import ChatService from "../services/chat.services.js";
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


    getMessage = async (req, res)=>{
        const chatId = req.header('chatId')
        const response = await pool.query('SELECT * FROM  `message` where chat_id = ? ', chatId); 
        console.log(response); 
    }

}