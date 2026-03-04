import dotenv from 'dotenv';
dotenv.config(); 

export default configDataPool = {
    host: process.env.DB_host,
    user: "",
    password: "",
    database: ""
};