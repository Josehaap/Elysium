import { send } from 'vite';
import UserService from '../services/user.services.js';
import Helper from '../utils/helpers.js';
import UserValidators from '../validators/UserValidators.js';
import User from '../model/User.js';
import Exception from '../utils/exceptions.js';
import bcrypt from "bcrypt";
;

const helper = new Helper(); 

export default class UserController {

    #userService = new UserService();  
    #response = {
        Success: null, 
        Data:null, 
        Error: null 
    }

    #valuesError = [false, {}, "Hubo un error inesperado"];

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
       try {
        //Todo Implementar la logica de crear carpeta para guardar foto perfil. 
        //Todo Implementar envio de gmail
        //Todo implementar comprobación de imagenes y videos que se han aptos. 
            console.log('Este es el usuairo recibido: ')
            console.log(req.body)
            //Comprobamos las claves y luego los valores. 
            UserValidators.validateKeys(req.body)
            UserValidators.validateValues(req.body) 
            const data = req.body;
            //Si todo ha salido bien instanciamos al usuario 
            let user = new User(data.username, data.email);
            user.firstName = data.first_name;
            //Esperamos que se codifiquen la contraseña. 
            await user.setPassword(data.password);
            user.surnames = data.surnames; 
            user.iAmEnterprise = data.iAmEnterprise;

            const RESPONSE = await this.#userService.insertUser(user); 
            //Si recibimos null significa que ha sido un error critico del servidor. 
            if (RESPONSE === null) return res.status(500).send(helper.generateRespond(this.#response, this.#valuesError)); 
            //Encambio si recibimos false significa que el usuario ya está registrado 
            if(!RESPONSE[0]) return res.status(409).send(helper.generateRespond(this.#response, RESPONSE))
            
            //Si todo está bien le informamos de que si existe 
            return res.status(200).send(helper.generateRespond(this.#response, RESPONSE))
            
        } catch (error) {
            console.log("He entrado aquí ")
            console.log(error.message);
            this.#valuesError[2] = error.message; 
            res.status(400).send(helper.generateRespond(this.#response, this.#valuesError))
        }
    }


    userLoginValidate = async (req, res)=>{
        try {

            if (!req.body.userIdentification || !req.body.password || req.body.userIdentification ==="" ||req.body.password ==="") 
                throw new Exception("No existe el nombre del usuario o la contraseña no se ha enviado")
            //Si existe sacamos las variables: */
            const {userIdentification, password } = req.body;
            console.log(password);
            let hola = await bcrypt.hash(password, 10);
            console.log(hola);
            //comrpobamos que el usuario exista. 
            const USERNAMEEXIST = await this.#userService.getUserBy('username', userIdentification);   
            console.log(USERNAMEEXIST) 

            const EMAILEXIST = await this.#userService.getUserBy('email', userIdentification);
            console.log(EMAILEXIST) 

            if(USERNAMEEXIST.length === 0 && EMAILEXIST.length === 0) {
                return res.status(401).send(helper.generateRespond(this.#response, [false, {exists:false}, "El usuario no existe."]));    
            }

            const {user_id, first_name, surnames, username,email, profile_img } = USERNAMEEXIST.length === 0 ? EMAILEXIST: USERNAMEEXIST;
           //Teniendo el response haremos primero una comprobación con el password: 
           
           // Aún puedes usar compare para verificar la contraseña
            const esValido = bcrypt.compareSync(password, RESPONSE[0].password);
            if (esValido) //! Hacer el envio de dato recordar databsae unique hay que reiniciar. 
                return res.status(200).send(helper.generateRespond(this.#response), [true,{},"  " ])
            return res.status(200).send(helper.generateRespond(this.#response, [true, "", ""]))

        } catch (error) {
            if ( error instanceof Exception) {
                console.log('asd')
                this.#valuesError[2] = error.message;
                return res.status(401).send(helper.generateRespond(this.#response, this.#valuesError));  
            }

            return res.status(500).send(helper.generateRespond(this.#response, this.#valuesError));  

        }
    }
}