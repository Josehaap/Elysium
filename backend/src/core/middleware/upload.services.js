import multer from 'multer';
import path from 'path';
import fs from 'fs';
/**
 * Clase encargada de la administración de las imagenes tanto la comprobacion como obtener y subirla
 */

export default class UploadServices {
    static #pathImg = path.join(process.cwd(), 'imgUsers')
    //Configuramos donde se va a guardar los archivos indicmos la carpeta y el nuevo nombre del archivo
    static #storage = multer.diskStorage({
        destination: (req, file, cb)=>{ 
            try {
                //Comprobaremos que la carpeta del usuario exista (si no lo manda, usamos fallback)
                const userFolder = req.body.username ? req.body.username : 'unnamed';
                const carptPathUser = path.join(UploadServices.#pathImg, userFolder, "fotoPerfil");
                    
                if (!fs.existsSync(carptPathUser)) {
                    fs.mkdirSync(carptPathUser, { recursive: true });
                }
                cb(null, carptPathUser); //Guardamos en la carpeta específica
            } catch (error) {
                cb(error, null);
            }
        }, 
        filename: (req, file, cb) => { //Modificamos el nombre del archivo para que no haya ninguna sobreescritura. 
            cb(null, 'foto_perfil.png');
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

   
}