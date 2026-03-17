import  pool from "./src/database/db.js";
import app from "./src/app.js"; 
import userRouter from "./src/routes/user.routes.js"
import UserController from "./src/controllers/user.controller.js";
//Creamos la intancia de express y hacemos uso de middlware par indicar que se permite las conexiones 
//y que se recibirá datos en formato json. 
 app.use("/user", userRouter);



import bcrypt from 'bcrypt'

const password = 'miContraseña123';

async function hashPassword(password) {
  const saltRounds = 10; // nivel de seguridad
  const hash = await bcrypt.hash(password, saltRounds);
  console.log('Hash:', hash);
  return hash;
}

hashPassword(password);























 
   //const user = new UserController();
 //user.getUserRegister({field: "username", value:"carlos123"});
/*
app.post('/register',(req, res)=>{
    console.log(req);
    res.status(200).json({ status: "ok", message: "Usuario registrado" });

});

//TODO - Implementar la conexión a base de datos. 
app.get("/register", async (req, res) => {
    const nameOrEmailUser = req.query.usuario; 
    const response = await con.query(`SELECT  EXISTS(select 1 from user  where username ="${nameOrEmailUser}" OR email = "${nameOrEmailUser}" ) as userExists`);
     const boolean = (response[0][0].userExists !== 0); 
    const iSend = {
        exists : boolean , 
        message: boolean ? `Ya existe un usuario con nombre o correo: ${nameOrEmailUser}` :"No existe usuario"
    }

   res.json(iSend);
});

app.post("/", async (req, res)=>{
    const data = req.body; 
    const result = await con.query(`INSERT INTO user(first_name,surnames, username, password, email, profile_img) 
                values("${data.first_name}","${data.surnames}","${data.username}","${data.password}","${data.email}","${data.profile_img}");` )
            console.log(result); 
    res.send("data recibida");
});


*/