import app from "./src/app.js";   //*Importamos la creación de nuestro servidor y la inicialización. 
import userRouter from "./src/routes/user.routes.js"; //Importamos las rutas de los usuarios. 
/**
 * *File - Archivo utilizado para centrar toda la funcionalidad de middleware y la conexión a la base de datos y todo lo demás. 
 */

//import Gmail from './src/utils/gmail.js';

app.use("/user", userRouter); //! Todo aquel que entre a través de user entrará a las rutas de los usuarios. 





import brevo from "@getbrevo/brevo";

const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  "yourapikey"
);

async function main() {
    const apiInstance = new Brevo.TransactionalEmailsApi();

        // Leemos la API key desde las variables de entorno
        apiInstance.setApiKey(
            brevo.TransactionalEmailsApiApiKeys.apiKey,
            process.env.GMAILAPIKEY
        );
    // db query
    const user = {
        name: "Juan Perez",
        email: "fazttech@gmail.com"
    }

  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = "Hello world from brevo and Nodejs";
    sendSmtpEmail.to = [
      { email: user.email, name: user.name },
    //   { email: "fazttech@gmail.com", name: "Joe Mcmillan" },
    ];
    sendSmtpEmail.htmlContent = `<html><body><h1>Hola ${user.name}</h1><p>This is a test email</p><button>Click me</button><a href='https://www.faztweb.com'>Go to my website</a></body></html>`;
    sendSmtpEmail.sender = {
      name: "FaztWeb",
      email: "fazt@faztweb.com",
    };

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log(result);
  } catch (error) {
    console.error(error);
  }
}
























 
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