import app from "./src/app.js";   //*Importamos la creación de nuestro servidor y la inicialización. 
import userRouter from "./src/routes/user.routes.js"; //Importamos las rutas de los usuarios. 
import postRouter from "./src/routes/post.routes.js"; //Importamos las rutas de los usuarios. 
import chatRouter from "./src/routes/chat.routes.js"; //Importamos las rutas del chat.

/**
 * *File - Archivo utilizado para centrar toda la funcionalidad de middleware y la conexión a la base de datos y todo lo demás. 
 */
app.use("/user", userRouter); //! Todo aquel que entre a través de user entrará a las rutas de los usuarios. 


app.use('/post', postRouter);
app.use('/chat', chatRouter); //! Todo aquel que entre a través de chat entrará a las rutas del chat.