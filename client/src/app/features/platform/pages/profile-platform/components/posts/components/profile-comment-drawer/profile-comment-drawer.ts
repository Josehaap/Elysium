import { Component, input, output, computed } from '@angular/core';
import { Post } from '../../../../models/profile';
import { Comments } from 'src/app/features/shared/comments/comments';
import { environment } from 'src/environments/environment';
import { CommentAction, CommentEvent } from 'src/app/features/shared/comments/models/message';

/**
 * Componente Popup/Drawer para mostrar los comentarios de un post en el perfil.
 * Reutiliza el componente <app-comments> pero lo muestra de forma flotante.
 */
@Component({
  selector: 'app-profile-comment-drawer',
  imports: [Comments],
  templateUrl: './profile-comment-drawer.html',
  styleUrl: './profile-comment-drawer.css',
})
export class ProfileCommentDrawer {
  // Recibimos el post completo para poder mostrar la imagen y pasar el id
  public post = input.required<Post>();
  
  // Evento para avisar al padre que cierre el popup
  public onClose = output<void>();
  
  // Evento para propagar acciones sobre los comentarios (añadir, eliminar)
  public onCommentAction = output<CommentEvent>();

  // Calculamos la URL de la imagen del post
  public imgUrlPost = computed(() => {
    const imgPost = this.post().img;
    if (!imgPost || imgPost === '') return 'img/placeholder/publish/publish.webp';
    if (imgPost.startsWith('http') || imgPost.startsWith('blob')) return imgPost;
    return `${environment.apiUrl}/${imgPost}`;
  });

  // Cierra el popup
  closeDrawer() {
    this.onClose.emit();
  }

  // Maneja los eventos que emite el componente de comentarios
  handleCommentAction(event: CommentEvent) {
    this.onCommentAction.emit(event);
    if (event.action === CommentAction.CLOSED) {
      this.closeDrawer();
    }
  }
}
