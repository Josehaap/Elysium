import fs from "fs";
import path from 'path';

/**
 * Clase que me permitirá utilizar diferentes funciones que me ayudará a no escribir el mismo codigo siempre
 */

export default class Helper {

  #pathRaizCarpeta = "./imgUsers"
  constructor() {}
  generateLiteralObject(params, values) {
    try {
      if (Object.keys(params).length !== values.length)
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

  /**
   * Mezcla los elementos de un array de forma aleatoria intercambiando 
   * posiciones mediante el algoritmo Fisher-Yates, sin crear nuevos 
   * valores.
   * @param {*} array 
   * @returns 
   */
  shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
}
