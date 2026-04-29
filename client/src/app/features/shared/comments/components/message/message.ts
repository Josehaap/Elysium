import { Component, computed, inject, input, output, signal } from '@angular/core';
import { IMessage } from '../../models/message';
import { TokenService } from 'src/app/core/services/token-service';
import { environment } from 'src/environments/environment';
import { CommentApi } from '../../services/comments-api';
import { Router } from '@angular/router';


@Component({
  selector: 'app-message',
  imports: [],
  templateUrl: './message.html',
  styleUrl: './message.css',
})
export class Message {
  //Cuando se carge el mensaje vamos a comprobar si el comentario procede del usuario o de otro usuario
  private commentApi = inject(CommentApi);
  private router = inject(Router);
  public onDelete = output<void>();

  protected activeClassExpanded = signal<boolean>(false);
  protected isMenuOpen = signal<boolean>(false);
  public dataComment = input.required<IMessage>(); 
  protected isTheSameUSer = computed(() => this.dataComment().username === TokenService.getUsenameToken()); 

  protected profileImg = computed(() => {
    const img = this.dataComment().profile_img;
    if (!img || img === '') return 'img/placeholder/profile/profile_userDefault.webp';
    if (img.startsWith('http') || img.startsWith('blob')) return img;
    return `${environment.apiUrl}/${img}`;
  });
  
  ngOnInit(){
  }


  protected toggleMenu(){
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  protected deleteComment() {
    this.commentApi.deleteComment(this.dataComment().comment_id).subscribe({
      next: () => {
        this.onDelete.emit();
        this.isMenuOpen.set(false);
      }
    });
  }

  protected goToProfile() {
    this.router.navigate([`elysium/profile/${this.dataComment().username}`]);
  }


}
