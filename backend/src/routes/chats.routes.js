import express from "express";
import Token from "../core/middleware/Token.js";
const router = express.Router(); //Generamos una instancia de las funcione de enrutamiento.
import pool from "../core/config/database/db.js";
import Exception from "../utils/exceptions.js";
import ChatController from "../controllers/ChatPage.controller.js";
import jwt from "jsonwebtoken";

/**
 * @File - Archivo utilizado para administrar las rutas de usuarios.
 * @author Jose de Haro Jiménez.
 */

const chatController = new ChatController(); 
router.get("/exists" , Token.validateToken, chatController.comprobateExist); 

router.get("/getChats", Token.validateToken, chatController.getChats);

router.get("/messages", Token.validateToken, chatController.getMessages);


router.post("/insertChat",Token.validateToken, chatController.createChat);

// Alias para iniciar chat desde el frontend
router.post("/start", Token.validateToken, chatController.createChat);

// Ruta para enviar mensajes vía REST (necesaria para ciertas acciones del frontend)
router.post("/send", Token.validateToken, chatController.sendMessage);

export default router;