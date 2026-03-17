import bcrypt from 'bcrypt'

export default class UserValidators{
    #username //Nombre de usuario en la plataforma. 
    #email 
    #password //Almacenaremos la contraseña ya cifrada
    #levelSegurityPassword = 10; 
    #first_name
    #surname
    #profile_img
    #iAmEnterprise
    keysUser = ["first_name", "surname","username", "email", "password", "profile_img", "iAmEnterprise"]; 
    

    constructor(username , email) {
        this.#email = email;
        this.username = username; 
    }

    set username(username){ this.#username = username };

    get username (){ return this.#username };

    set email(email){ this.#email = email };

    async setPassword(password){ this.#password = bcrypt.hash(password, this.#levelSegurityPassword) };

    get password (){ return this.#password };

    set firstName(name) { this.#first_name = name };

    get firstName() { return this.#first_name};

    set surname(surname) { this.#surname = surname };

    get surname() { return this.#surname};

    set iAmEnterprise(value){ this.#iAmEnterprise = value };

    get iAmEnterprise(){  return this.#iAmEnterprise};

    /** TODO - IMmplementar validación y crear instancias de usuarios y almacenar en la  base de datos no debe instanciar aquí. . 
     * 
     * @param {*} dataUser 
     * @returns 
     */
    static validateData(dataUser){
    const requiredKeys = ["first_name", "surname", "username", "email", "password", "profile_img", "iAmEnterprise"];

    const isValid = requiredKeys.every(key => Object.keys(dataUser).includes(key));

    if (!isValid) {
        // Alguna key falta → lanzar error o devolver instancia default
        throw new Error("Faltan campos obligatorios");
    } else {
    }
}
        
}