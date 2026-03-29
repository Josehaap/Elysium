import dotenv from 'dotenv';
dotenv.config(); 
//! Arreglar el problema de que no consiga obtener el nombre y a contraseña del archivo .env
const configDataPool = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, 
    port: process.env.DB_PORT
};

export default configDataPool;