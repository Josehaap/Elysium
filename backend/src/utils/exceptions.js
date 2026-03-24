/**
 * Esta clase me permitirá lanzar errores encapsulado en una clase llamado Exception, 
 * gracias a esto puedo lanzar errores pero tratarlos diferentes. 
 * ? Why - Para poder tratar de manera diferentes dandoles una nivel de prioridad
 * * Un ejemplo: Si hago una consulta y no deberia obtener datos y obtengo como por ejemplo 
 * * una comprobacion de si un usuario existe antes de insertar un usuario, eso no debería dar error
 * * sino informar. 
 * *Por ello gracias a esta clase en los try catch puedo comprobar que tipo de "error" es y devolver datos o nnull
 * * UN ejemplo muy claro sería en @page {user.services.insertUser}

 */

export default class Exception extends Error {
    constructor(message) {
        super(message);
        this.name = 'Exception';
    }
}