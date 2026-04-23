/**
 * ChatPlatform - Componente principal del módulo de chat.
 * 
 * Muestra una interfaz tipo Instagram con dos paneles:
 *   - Panel izquierdo: lista de conversaciones con el último mensaje
 *   - Panel derecho: conversación activa con los mensajes ordenados por tiempo
 * 
 * Los chats son de 1 a 1 entre usuarios.
 */
import { Component, inject, signal, computed, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { ChatApi } from './services/chat-api';
import { ChatMessage, ChatPreview } from './models/chat';
import { TokenService } from 'src/app/core/services/token-service';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { accessToken } from '../../../shared/models/shared';

@Component({
  selector: 'app-chat-platform',
  imports: [DatePipe],
  templateUrl: './chat-platform.html',
  styleUrl: './chat-platform.css',
})
export class ChatPlatform implements AfterViewChecked {
  // Inyección de dependencias
  protected chatApi = inject(ChatApi);

  // Referencia al contenedor de mensajes para auto-scroll
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  // ID del usuario autenticado (extraído del token)
  protected currentUserId: number = Number(
    jwtDecode<accessToken>(TokenService.getToken())['id']
  );

  // Chat seleccionado actualmente
  protected selectedChat = signal<ChatPreview | null>(null);

  // Mensajes del chat seleccionado
  protected messages = signal<ChatMessage[]>([]);

  // Estado de carga de los mensajes
  protected loadingMessages = signal(false);

  // Estado de envío de mensaje
  protected sendingMessage = signal(false);

  // Flag para auto-scroll cuando llegan nuevos mensajes
  private shouldScroll = false;

  /**
   * Selecciona un chat y carga sus mensajes.
   * Marca el chat como activo y resetea el contador de no leídos visualmente.
   * 
   * @param chat - Chat seleccionado de la lista
   */
  selectChat(chat: ChatPreview) {
    // Si ya está seleccionado, no hacemos nada
    if (this.selectedChat()?.chat_id === chat.chat_id) return;

    this.selectedChat.set(chat);
    this.loadingMessages.set(true);

    // Cargamos los mensajes del chat seleccionado
    this.chatApi.getMessages(chat.chat_id).subscribe({
      next: (msgs) => {
        this.messages.set(msgs);
        this.loadingMessages.set(false);
        this.shouldScroll = true;

        // Reseteamos el unread_count visualmente al seleccionar el chat
        chat.unread_count = 0;
      },
      error: () => {
        this.loadingMessages.set(false);
      },
    });
  }

  /**
   * Envía un mensaje al chat actualmente seleccionado.
   * Actualiza la lista de mensajes localmente para feedback inmediato
   * y luego envía la petición al servidor.
   * 
   * @param input - Referencia al input de texto
   */
  sendMessage(input: HTMLInputElement) {
    const content = input.value.trim();
    const chat = this.selectedChat();

    // Validaciones
    if (!content || !chat || this.sendingMessage()) return;

    // Limpiamos el input inmediatamente
    input.value = '';

    // Añadimos el mensaje localmente para feedback instantáneo (optimistic update)
    const optimisticMessage: ChatMessage = {
      message_id: Date.now(), // ID temporal
      content,
      sennt_at: new Date().toISOString(),
      is_read: false,
      user_send_id: this.currentUserId,
      sender_username: jwtDecode<accessToken>(TokenService.getToken())['username'],
      sender_profile_img: '',
    };

    this.messages.update((prev) => [...prev, optimisticMessage]);
    this.shouldScroll = true;

    // Actualizamos el último mensaje en la lista de chats
    chat.last_message = content;
    chat.last_message_at = optimisticMessage.sennt_at;
    chat.last_message_sender_id = this.currentUserId;

    // Enviamos el mensaje al servidor
    this.sendingMessage.set(true);
    this.chatApi.sendMessage(chat.chat_id, content).subscribe({
      next: () => {
        this.sendingMessage.set(false);
      },
      error: () => {
        this.sendingMessage.set(false);
        // Si falla, podríamos eliminar el mensaje optimistic (opcional)
      },
    });
  }

  /**
   * Construye la URL completa de la imagen de perfil.
   * Si la imagen es una URL externa o blob, la devuelve directamente.
   * Si no, la construye con la URL base del API.
   * 
   * @param profileImg - Ruta de la imagen del usuario
   * @returns URL completa de la imagen
   */
  getProfileImgUrl(profileImg: string | null): string {
    if (!profileImg || profileImg === '') {
      return 'img/placeholder/profile/profile_userDefault.webp';
    }
    if (profileImg.startsWith('http') || profileImg.startsWith('blob')) {
      return profileImg;
    }
    return `${environment.apiUrl}/${profileImg}`;
  }

  /**
   * Formatea la fecha del último mensaje para mostrar en la lista de chats.
   * Si es hoy muestra la hora, si no muestra la fecha.
   * 
   * @param dateStr - Fecha en formato string ISO
   * @returns Texto formateado de la fecha
   */
  formatChatDate(dateStr: string | null): string {
    if (!dateStr) return '';

    const date = new Date(dateStr);
    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      // Mostramos solo la hora (HH:mm)
      return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    // Mostramos fecha corta (dd/mm)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
    });
  }

  /**
   * Auto-scroll al final de los mensajes cuando se añade uno nuevo.
   */
  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  /**
   * Hace scroll hasta el último mensaje del contenedor.
   */
  private scrollToBottom() {
    try {
      const el = this.messagesContainer?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    } catch (err) {
      // Silenciar errores si el contenedor no existe aún
    }
  }
}
