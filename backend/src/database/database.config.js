import dotenv from 'dotenv';
dotenv.config(); 
//! Arreglar el problema de que no consiga obtener el nombre y a contraseña del archivo .env
const configDataPool = {
    host: process.env.DB_HOST,
    user: 'userAdmin',
    password: '1234',
    database: process.env.DB_NAME, 
    port: process.env.DB_PORT
};

export default configDataPool;