import app from "./src/app.js";   //*Importamos la creación de nuestro servidor y la inicialización. 
import userRouter from "./src/routes/user.routes.js"; //Importamos las rutas de los usuarios. 
/**
 * *File - Archivo utilizado para centrar toda la funcionalidad de middleware y la conexión a la base de datos y todo lo demás. 
 */
 app.use("/user", userRouter); //! Todo aquel que entre a través de user entrará a las rutas de los usuarios. 



























 
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