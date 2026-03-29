import fs from "fs";
import path from 'path';

/**
 * Clase que me permitirá utilizar diferentes funciones que me ayudará a no escribir el mismo codigo siempre
 */

export default class Helper {

  #pathRaizCarpeta = "./imgUsers"
  constructor() {}
  generateRespond(params, values) {
    try {
      if (params.length !== values.lenght)
        throw new Error(
          "Minimo debería tener las mismas longitudes los valores que no quiereas agregar que sehan espacios vacios o null. ",
        );
      const result = {};
      Object.keys(params).forEach((key, index) => {
        result[`${key}`] = values[index];
      });
      return result;
    } catch (error) {
      console.error(error.message);
    }
  }

  mkdirAndUploadImg(nameUser, nameFieldwithExtension) {
    fs.mkdir(`${this.#pathRaizCarpeta}/${nameUser}`, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Carpeta creada");
      
    });
  }
}
