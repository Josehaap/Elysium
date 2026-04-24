import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Token from './Token.js';
import jwt from "jsonwebtoken";

/**
 * Clase encargada de la administración de las imagenes tanto la comprobacion como obtener y subirla
 */

export default class UploadServices {
    static #pathImg = path.join(process.cwd(), 'imgUsers')
    //Configuramos donde se va a guardar los archivos indicmos la carpeta y el nuevo nombre del archivo
    static #storage = multer.diskStorage({
        destination: (req, file, cb)=>{ 
            try {
                const token = req.header('accessToken')?? ''; 
                let userFolder = '';
                if (token !='') userFolder = jwt.decode(token)['username'] ? jwt.decode(token)['username'] : 'unnamed';
                else userFolder = req.body['username'];
                //Comprobaremos que la carpeta del usuario exista (si no lo manda, usamos fallback)
                
                const carptPathUser = (!req.header('submitPost') || req.header('submitPost') === '0')? path.join(UploadServices.#pathImg, userFolder, "fotoPerfil"): path.join(UploadServices.#pathImg, userFolder, "post") ;
                console.log('slow cortisol');
                if (!fs.existsSync(carptPathUser)) {
                    fs.mkdirSync(carptPathUser, { recursive: true });
                }
                cb(null, carptPathUser); //Guardamos en la carpeta específica
            } catch (error) {
                cb(error, null);
            }
        }, 
        filename: (req, file, cb) => { //Modificamos el nombre del archivo para que no haya ninguna sobreescritura. 
            if ((!req.header('submitPost') || req.header('submitPost') === '0')) {
                cb(null, 'foto_perfil.png');
            } else {
                cb(null, Date.now() + '-' + file.originalname);
            }
        }
    });

    static validateImg = ()=>{
        //Devolverá el muter, pero configurado para que determine donde (y el nombre del archivo ), el tamaño y valide la imgen 
        return multer({
            storage: this.#storage, //Indicamos lugar de subida y nombre de archivo directamente. 
            limits: (2* 1024* 1024), //2mb //indicamos un numero que será el limite del tamaño del archivo 
            fileFilter:(req, file, cb)=> { //Aquí podremos indicar algún filtrado de los archivos. 

                cb(null, true) //Devolveremos null si falla o true. 
            }


        });
    }

    static getRelativePath (pathAbsolute){
        return path.relative(process.cwd(), pathAbsolute);
    }

    /**
     * Elimina de manera recursiva la carpeta raíz de un usuario específico.
     * Al usar path.join con el username exacto, se asegura de eliminar solo esa carpeta
     * (por ejemplo "joSe_haap") y no carpetas con nombres similares (como "joselito").
     * @param {string} username - Nombre de usuario de la carpeta a eliminar.
     */
    static deleteUserFolder(username) {
        try {
            if (!username) return false;
            
            const userFolder = path.join(UploadServices.#pathImg, username);
            
            if (fs.existsSync(userFolder)) {
                fs.rmSync(userFolder, { recursive: true, force: true });
                console.log(`Carpeta eliminada exitosamente: ${userFolder}`);
                return true;
            }
            return false;
        } catch (error) {
            console.error(`Error al eliminar la carpeta del usuario ${username}:`, error);
            return false;
        }
    }

    /**
     * Elimina una imagen específica a partir de la ruta guardada en la base de datos.
     * @param {string} imagePath - Ruta relativa o absoluta de la imagen a eliminar.
     */
    static deleteImageByPath(imagePath) {
        try {
            if (!imagePath) return false;

            // Resolvemos la ruta para asegurarnos de que es absoluta y válida
            const absolutePath = path.resolve(process.cwd(), imagePath);

            // Comprobamos si el archivo existe y si realmente es un archivo
            if (fs.existsSync(absolutePath) && fs.statSync(absolutePath).isFile()) {
                fs.unlinkSync(absolutePath);
                console.log(`Imagen eliminada exitosamente: ${absolutePath}`);
                return true;
            }
            
            console.log(`La imagen no existe o ya fue eliminada: ${absolutePath}`);
            return false;
        } catch (error) {
            console.error(`Error al eliminar la imagen en la ruta ${imagePath}:`, error);
            return false;
        }
    }
}