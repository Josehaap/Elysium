/**
 * ChatPlatform - Componente principal del módulo de chat.
 * 
 * Muestra una interfaz tipo Instagram con dos paneles:
 *   - Panel izquierdo: lista de conversaciones con el último mensaje
 *   - Panel derecho: conversación activa con los mensajes ordenados por tiempo
 * 
 * Los chats son de 1 a 1 entre usuarios.
 */
import { Component, inject, signal, computed, ElementRef, ViewChild, AfterViewChecked, OnInit } from '@angular/core';
import { ChatApi } from './services/chat-api';
import { ChatMessage, ChatPreview } from './models/chat';
import { TokenService } from 'src/app/core/services/token-service';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { accessToken } from '../../../shared/models/shared';
import { SharedPostCard } from '../../../shared/shared-post-card/shared-post-card';

@Component({
  selector: 'app-chat-platform',
  imports: [DatePipe, SharedPostCard],
  templateUrl: './chat-platform.html',
  styleUrl: './chat-platform.css',
})
export class ChatPlatform implements OnInit, AfterViewChecked {
  // Inyección de dependencias
  protected chatApi = inject(ChatApi);

  // Lista de chats procesada desde el resource de la API
  protected chatList = computed(() => {
    const res = this.chatApi.getChatList.value() as any;
    return res?.Success ? res.Data as ChatPreview[] : [];
  });

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

  // Conexión WebSocket
  private socket!: WebSocket;

  ngOnInit() {
    this.initWebSocket();
  }

  private initWebSocket() {
    const wsUrl = environment.apiUrl.replace('http://', 'ws://').replace('https://', 'wss://');
    this.socket = new WebSocket(wsUrl);

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'new_message') {
        const newMessage = message.data;
        // Solo añadimos el mensaje si pertenece al chat seleccionado y no es nuestro (ya lo añadimos optimísticamente)
        if (this.selectedChat()?.chat_id === newMessage.chat_id && newMessage.user_send_id !== this.currentUserId) {
          this.messages.update(prev => [...prev, newMessage]);
          this.shouldScroll = true;
        }
      }
    };

    this.socket.onclose = () => {
      console.log('WebSocket desconectado, reintentando...');
      setTimeout(() => this.initWebSocket(), 3000);
    };
  }

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
      next: (res: any) => {
        if (res.Success) {
          this.messages.set(res.Data);
          this.shouldScroll = true;
          chat.unread_count = 0;
        }
        this.loadingMessages.set(false);
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

    // Enviamos el mensaje al servidor vía WebSocket para tiempo real
    this.socket.send(JSON.stringify({
      chat_id: chat.chat_id,
      user_send_id: this.currentUserId,
      content: content
    }));

    this.sendingMessage.set(false);
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
