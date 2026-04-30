import app from "./src/app.js";   //*Importamos la creación de nuestro servidor y la inicialización. 
import userRouter from "./src/routes/user.routes.js"; //Importamos las rutas de los usuarios. 
import postRouter from "./src/routes/post.routes.js"; //Importamos las rutas de los usuarios. 
import chatRouter from "./src/routes/chats.routes.js"; //Importamos las rutas de los usuarios. 
import chatbotRouter from "./src/routes/chatbot.routes.js";
import { WebSocketServer } from 'ws';
import http from 'http';
import pool from "./src/core/config/database/db.js";

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    console.log('Cliente conectado al chat');

    ws.on('message', async (data) => {
        try {
            const messageData = JSON.parse(data.toString());
            const { chat_id, user_send_id, content, post_id } = messageData;

            // Guardar en la base de datos (sennt_at se genera automáticamente o por NOW())
            await pool.query(
                'INSERT INTO message (chat_id, user_send_id, content, post_id, sennt_at) VALUES (?, ?, ?, ?, NOW())',
                [chat_id, user_send_id, content, post_id || null]
            );

            // Broadcast a todos los clientes conectados
            const responseData = JSON.stringify({
                type: 'new_message',
                data: {
                    chat_id,
                    user_send_id,
                    content,
                    post_id,
                    sennt_at: new Date()
                }
            });

            wss.clients.forEach((client) => {
                if (client.readyState === 1) { // 1 = OPEN
                    client.send(responseData);
                }
            });
        } catch (error) {
            console.error('Error al procesar mensaje WS:', error);
        }
    });

    ws.on('close', () => {
        console.log('Cliente desconectado');
    });
});

/**
 * *File - Archivo utilizado para centrar toda la funcionalidad de middleware y la conexión a la base de datos y todo lo demás. 
 */
app.use("/user", userRouter); 
app.use('/post', postRouter);
app.use('/chat', chatRouter);
app.use('/chatbot', chatbotRouter);

server.listen(3000, () => {
    console.log('Servidor ejecutándose en http://localhost:3000 con WebSockets');
});