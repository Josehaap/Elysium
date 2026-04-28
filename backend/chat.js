import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

console.log("Servidor corriendo en ws://localhost:8080");

wss.on('connection', (ws) => {
console.log("Nuevo cliente conectado");

ws.on('message', (message) => {
    const text = message.toString();
    console.log("Mensaje:", text);

    // Enviar a TODOS
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(text);
        }
    });
});

ws.on('close', () => {
    console.log("Cliente desconectado");
});

});