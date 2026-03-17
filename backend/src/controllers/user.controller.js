import { send } from 'vite';
import UserService from '../services/user.services.js';
import Helper from '../utils/helpers.js';

const helper = new Helper(); 

export default class UserController {

    
    
    #userService = new UserService();  
    #response = {
        Success: null, 
        Data:null, 
        Error: null 
    }

    #valuesError = [false, [], "Hubo un error inesperado"];

    getUserRegisterByValidation = async (req, res) => {
        try {
            const {field, value}= req.query; 
            if (!field || field === undefined || field === "") throw new Error("Campo vacío");
            const RESPONSE = await this.#userService.getUserBy(field, value, false);
            if (!RESPONSE) res.status(400).send(helper.generateRespond(this.#response, this.#valuesError)); 
            if (RESPONSE.length !== 0 ) res.status(200).send(helper.generateRespond(this.#response,[true, {exists: true}, ""] ));
            else res.status(200).send(helper.generateRespond(this.#response,[true, {exists: false}, ""]));
        } catch (error) {
            this.#valuesError[2] = error.message; 
            res.status(400).send(helper.generateRespond(this.#response, this.#valuesError)); 
        }
        
    }
    userRegister= async (req, res)=>{
    //Destructuring: 
        if (req.hasown) {
            
        }
        const {nombre, apellido, username, email, password, profile_img, iAmEnterprise} = req.body;
        const data = req.body
        console.log("Data recibida")
    console.log(data)
    }
}