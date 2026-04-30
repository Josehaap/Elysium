import Exception from "../utils/exceptions.js";
import Helper from "../utils/helpers.js";

const helper = new Helper();

export default class ChatbotController {
    #response = {
        Success: null,
        Data: null,
        Error: null,
    };

    askOllama = async (req, res) => {
        try {
            const { message } = req.body;
            if (!message) throw new Exception("Mensaje no proporcionado");

            // 1. Intentar obtener los modelos disponibles para ver si Ollama está corriendo
            let models = [];
            try {
                const tagsResponse = await fetch("http://localhost:11434/api/tags");
                if (tagsResponse.ok) {
                    const tagsData = await tagsResponse.json();
                    models = tagsData.models.map(m => m.name);
                }
            } catch (e) {
                throw new Exception("No se pudo conectar con Ollama. ¿Está el servidor corriendo en http://localhost:11434?");
            }

            if (models.length === 0) {
                throw new Exception("Ollama está corriendo pero no tienes ningún modelo descargado. Ejecuta 'ollama run llama3' en tu terminal.");
            }

            // 2. Elegir modelo: preferir llama3, si no el primero disponible
            const modelToUse = models.includes("llama3:latest") || models.includes("llama3") 
                ? "llama3" 
                : models[0];

            console.log(`Usando modelo Ollama: ${modelToUse}`);

            const response = await fetch("http://localhost:11434/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: modelToUse,
                    messages: [
                        { role: "system", content: "Eres Elysium Assistant, un asistente útil para la plataforma Elysium." },
                        { role: "user", content: message }
                    ],
                    stream: false,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Exception(`Error de Ollama (${response.status}): ${errorData.error || response.statusText}`);
            }

            const data = await response.json();
            const botResponse = data.message.content;

            return res.status(200).send(helper.generateLiteralObject(this.#response, [true, botResponse, ""]));

        } catch (error) {
            console.error("Chatbot Error:", error.message);
            const status = error instanceof Exception ? 400 : 500;
            return res.status(status).send(helper.generateLiteralObject(this.#response, [false, {}, error.message]));
        }
    };
}
