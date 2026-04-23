/**
 * Servicio API para el módulo de chat.
 * Se encarga de todas las peticiones HTTP relacionadas con
 * la obtención de chats, mensajes, envío de mensajes y creación de chats.
 */
import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { TokenService } from 'src/app/core/services/token-service';
import { environment } from 'src/environments/environment';
import { ChatMessage, ChatPreview, ChatStartResponse, SendMessageResponse } from '../models/chat';

@Injectable({
  providedIn: 'root',
})
export class ChatApi {
  private http = inject(HttpClient);

  /**
   * Obtiene la lista de chats del usuario autenticado.
   * Cada chat incluye los datos del otro participante y el último mensaje.
   * Similar a la pantalla de DMs de Instagram.
   */
  public getChatList = httpResource<ChatPreview[]>(() => ({
    url: `${environment.apiUrl}/chat/list`,
    method: 'GET',
    headers: {
      accessToken: TokenService.getToken(),
    },
  }));

  /**
   * Obtiene los mensajes de un chat específico.
   * @param chatId - ID del chat
   * @returns Observable con la lista de mensajes ordenados cronológicamente
   */
  getMessages(chatId: number) {
    return this.http.get<ChatMessage[]>(
      `${environment.apiUrl}/chat/messages`,
      {
        params: { chatId: chatId.toString() },
        headers: { accessToken: TokenService.getToken() },
      }
    );
  }

  /**
   * Envía un mensaje a un chat existente.
   * @param chatId - ID del chat
   * @param content - Contenido del mensaje
   * @returns Observable con la respuesta del servidor
   */
  sendMessage(chatId: number, content: string) {
    return this.http.post<SendMessageResponse>(
      `${environment.apiUrl}/chat/send`,
      { chatId, content },
      {
        headers: { accessToken: TokenService.getToken() },
      }
    );
  }

  /**
   * Inicia o recupera un chat con otro usuario.
   * Si el chat ya existe lo devuelve, si no lo crea.
   * @param targetUserId - ID del usuario con el que se quiere chatear
   * @returns Observable con los datos del chat
   */
  startChat(targetUserId: number) {
    return this.http.post<ChatStartResponse>(
      `${environment.apiUrl}/chat/start`,
      { targetUserId },
      {
        headers: { accessToken: TokenService.getToken() },
      }
    );
  }
}
