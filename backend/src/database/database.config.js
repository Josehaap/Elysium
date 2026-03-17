import dotenv from 'dotenv';
dotenv.config(); 
const configDataPool = {
    host: process.env.DB_HOST,
    user: 'userAdmin',
    password: '1234',
    database: process.env.DB_NAME, 
    port: process.env.DB_PORT
};

export default configDataPool;