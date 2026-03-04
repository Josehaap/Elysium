import express from "express";
import  {pool} from "./src/databases/db.js";
//Configuramos nuestro servidor para recibir json. 
const app = express(); //Creamos el servidor

app.use(express.json()); // Middleware para poder recibir json.  

//Iniciamos el servidor. 
app.listen(3000, ()=>{
    console.log("http://localhost:3000")
});

//TODO - Implementar la conexión a base de datos. 
app.get("/", (req, res) => {
    
});

app.post("/", async (req, res)=>{
    const data = req.body; 
    const result = await pool.query(`INSERT INTO user(first_name,surnames, username, password, email, profile_img) 
                values("${data.first_name}","${data.surnames}","${data.username}","${data.password}","${data.email}","${data.profile_img}");` )
            console.log(result); 
    res.send("data recibida");
});