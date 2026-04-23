import { Component, inject, signal } from '@angular/core';
import { Post } from '../../../post/post';
import { Router } from '@angular/router';
import { HomeApi } from './services/home-api';
import { environment } from 'src/environments/environment';
import { RoutingElysium } from 'src/app/core/services/routingElysium';
import { TokenService } from 'src/app/core/services/token-service';
import { SugerensUser } from './components/sugerens-user/sugerens-user';
import { ListNews } from "./components/list-news/list-news";

@Component({
  selector: 'app-home-platform',
  imports: [Post, SugerensUser, ListNews],
  templateUrl: './home-platform.html',
  styleUrl: './home-platform.css',
})
export class HomePlatform {
  protected homeApi = inject(HomeApi);
  protected router = inject(Router);
  protected routingElysium = inject(RoutingElysium);
  protected imgUser: string = new URL(this.homeApi.imgUserUrl,environment.apiUrl).toString() ;

  // Mensajes del chat
  public messages = signal([
    { text: '¡Hola! Soy tu asistente de Elysium. ¿En qué puedo ayudarte hoy?', sender: 'bot' }
  ]);

  // Estado de carga del chatbot
  public isLoading = signal(false);

  // Método para enviar mensaje
  sendMessage(input: HTMLInputElement) {
    const text = input.value.trim();
    if (!text || this.isLoading()) return;

    // Añadir mensaje del usuario
    this.messages.update(prev => [...prev, { text, sender: 'user' }]);
    input.value = '';

    // Enviar petición HTTP al webhook
    this.isLoading.set(true);
    this.homeApi.sendChatMessage(text).subscribe({
      next: (response) => {
        this.messages.update(prev => [...prev, { text: response, sender: 'bot' }]);
        this.isLoading.set(false);
      },
      error: () => {
        this.messages.update(prev => [...prev, {
          text: 'Lo siento, hubo un error al procesar tu mensaje. Inténtalo de nuevo.',
          sender: 'bot'
        }]);
        this.isLoading.set(false);
      }
    });
  }

  goToPerfil =() =>{
    this.routingElysium.goToProfile(TokenService.getUsenameToken());
  }
  imgUrl = () => TokenService.getProfileImg();
}
