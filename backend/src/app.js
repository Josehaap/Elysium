/**
 * *File - Archivo de configuración global de express middleware. 
 */
import express from "express";
import cors from "cors"; 

    const app = express(); 
    app.use(cors()); //Que permita la conexión desde otra dirección. 
    app.use(express.json());  //Que pueda recibir json
    //Configuramos el pueto de escucha. 
    app.listen(3000);






export default app; 