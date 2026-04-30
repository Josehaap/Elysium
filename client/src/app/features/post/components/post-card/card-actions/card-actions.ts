import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { ActionApi } from './service/action-api';
import { SharePostModal } from '../../../../shared/share-post-modal/share-post-modal';
import { TokenService } from 'src/app/core/services/token-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-card-actions',
  imports: [SharePostModal],
  templateUrl: './card-actions.html',
  styleUrl: './card-actions.css',
})
export class CardActions {
  protected actionApi = inject(ActionApi);
  
  public iWantComment = output<boolean>(); 
  public iWantCommentValue = signal<boolean>(false); 

  public isLiked = input.required<boolean>();
  public likes = input.required<number>();
  public comments = input.required<number>();
  public shareds = input.required<number>();
  public id = input.required<string>();

  public showShareModal = signal(false);
  private manualSharedCount = signal(0);
  
  protected totalShareds = computed(() => this.shareds() + this.manualSharedCount());


  

  // Estado local para cuando el usuario hace clic
  private manualToggle = signal<boolean | null>(null);

  // Determina si está liked (prioriza el clic manual sobre el estado inicial)
  protected liked = computed(() => {
    const manual = this.manualToggle();
    return manual !== null ? manual : this.isLiked();
  });

  protected totalLikes = computed(() => {
    const initialLiked = this.isLiked();
    const currentlyLiked = this.liked();
    
    let offset = 0;
    if (initialLiked && !currentlyLiked) offset = -1; // Tenía like y se lo quité
    if (!initialLiked && currentlyLiked) offset = 1;  // No tenía y se lo puse

    return (this.likes() || 0) + offset;
  });

  // El color del corazón
  protected fill = computed(() => this.liked() ? 'black' : 'none');

  // Método unificado para el clic
  public toggleLike(): void {
    const currentState = this.liked();
    const newState = !currentState;

    if (newState) {
      this.actionApi.insertLike(this.id()).subscribe({
        next: () => this.manualToggle.set(true)
      });
    } else {
      this.actionApi.deleteLike(this.id()).subscribe({
        next: () => this.manualToggle.set(false)
      });
    }
  }

  public sendIwantViewComment(){
    this.iWantCommentValue.set(!this.iWantCommentValue())
    this.iWantComment.emit(this.iWantCommentValue());
  }

  public openShareModal() {
    this.showShareModal.set(true);
  }

  public onPostShared(chatId: string) {
    // 1. Incrementar contador en el backend
    this.actionApi.insertShared(this.id()).subscribe({
      next: () => {
        this.manualSharedCount.update(c => c + 1);
      }
    });

    // 2. Enviar mensaje por WebSocket
    const wsUrl = environment.apiUrl.replace('http://', 'ws://').replace('https://', 'wss://');
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      socket.send(JSON.stringify({
        chat_id: chatId,
        user_send_id: Number(TokenService.getIdToken()),
        content: "Ha compartido una publicación",
        post_id: this.id()
      }));
      setTimeout(() => socket.close(), 1000);
    };

    // 3. Cerrar modal
    this.showShareModal.set(false);
  }
}
