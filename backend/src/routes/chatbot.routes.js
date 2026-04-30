import express from "express";
import Token from "../core/middleware/Token.js";
import ChatbotController from "../controllers/Chatbot.controller.js";

const chatbotController = new ChatbotController();
const router = express.Router();

router.post("/ask", Token.validateToken, chatbotController.askOllama);

export default router;
