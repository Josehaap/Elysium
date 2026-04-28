/**
 * *File - Archivo de configuración global de express middleware. 
 */
import express from "express";
import cors from "cors"; 

const app = express();  //Creamos la instancia de express
app.use(cors()); //Cuando entremos (da igual la ruta) se iniciará cors permitiendonos pedir y mandar datos a otras direcciones ip
app.use(express.json());  //Nos permite reccibir los datos en formato json.
app.use('/imgUsers', express.static('imgUsers')); //Indicamos al servidor que esta carpeta es publica

//Configuramos el pueto de escucha. 
app.listen(3000); //Ejecutamos el servidor para que arranque. 
export default app; 