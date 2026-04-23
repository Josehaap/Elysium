/**
 * Interfaz que representa un chat en la lista de conversaciones.
 * Incluye los datos del otro participante y el último mensaje.
 */
export interface ChatPreview {
  chat_id: number;
  // Datos del otro usuario
  other_user_id: number;
  other_username: string;
  other_profile_img: string;
  // Último mensaje
  last_message: string | null;
  last_message_at: string | null;
  last_message_sender_id: number | null;
  // Mensajes sin leer
  unread_count: number;
}

/**
 * Interfaz que representa un mensaje individual dentro de un chat.
 */
export interface ChatMessage {
  message_id: number;
  content: string;
  sennt_at: string;
  is_read: boolean;
  user_send_id: number;
  sender_username: string;
  sender_profile_img: string;
}

/**
 * Interfaz para la respuesta al iniciar/obtener un chat.
 */
export interface ChatStartResponse {
  chat_id: number;
  user_1: number;
  user_2: number;
}

/**
 * Interfaz para la respuesta al enviar un mensaje.
 */
export interface SendMessageResponse {
  message_id: number;
  success: boolean;
}
