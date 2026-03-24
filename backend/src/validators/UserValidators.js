
export default class UserValidators {
  
  /** 
   * Devuelve un booleano si las key son va´lidad
   * @param {*} dataUser
   * @returns
   */
    static validateKeys(dataUser) {
        //Vamos a validar que existe todas las claves que vamos a necesitar en nuestro backend
        const requiredKeys = [
            "first_name",
            "surnames",
            "username",
            "email",
            "password",
            "profile_img",
            "iAmEnterprise"
        ];
        //Comprobamos que exista y que no esté vacio
        if (dataUser === null || dataUser === undefined || dataUser === "")
        throw new Error("El dato recibido es null ");
        //Luego comprobamos que el tipo es un objeto:
        if (Array.isArray(dataUser) || typeof dataUser !== "object")
        throw new Error("El dato recibido no es un objeto");
        //Sacamos las keys del objeto:

        const keys = Object.keys(dataUser);
        console.log(dataUser)
        //Ya que puede ser que reciba más datos que son relevantes para otras cosas.
        if (keys.length < requiredKeys.length)
        throw new Error(`El tamaño de los datos del usuario son distintos `);

        //Creo un set para eliminar valores duplicados
        const setKeys = new Set(keys);
        const setKeysRequired = new Set(requiredKeys);
        //!Aquí falla ver porque. 
        //Si el minimo de keys no se cumplen devolveremos true o false
        if (![...setKeysRequired].every((iNeedKey) => setKeys.has(iNeedKey)))throw new Error(
            "El tamaño de las claves no coincide minimamente con las requeridas, es decir faltan claves onligaatorias aunque el numero total de claves se han las mismas",
        );
        return true;
    }

    /**
     * Validate Es una función que valida los valores del objeto literal que se pase como parámetro. 
     * Se valida si no es null, undefined o vacio ya que en la base de datos son obligatorios y no pueden estar vacios. 
     * @param {*} dataUser 
     * @returns 
     */
    static validateValues(dataUser) {
        const needKeysWithValues =  ["first_name", "surnames", "username", "email","password" ] ;
        needKeysWithValues.forEach(key => {
        if (dataUser[key] === null || dataUser[key] === undefined || dataUser[key]=== "") 
            throw new Error(`Hay valores que necesariamente deben tener valores y {${key}} debe tener valor. `)
        });
        const maxLengths = {
            first_name: 50,
            surnames: 200,
            username: 50,
            password: 250,
            email: 100
        };

        for (const [key, max] of Object.entries(maxLengths)) {
            if (dataUser[key].length > max) {
                throw new Error(`Se ha sobrepasado el tamaño del campo: ${key}`);
            }
        }

        return true;
    }
}
