import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { ActionApi } from './service/action-api';

@Component({
  selector: 'app-card-actions',
  imports: [],
  templateUrl: './card-actions.html',
  styleUrl: './card-actions.css',
})
export class CardActions {
  protected actionApi = inject(ActionApi);
  
  public isLiked = input.required<boolean>();
  public likes = input.required<number>();
  public comments = input.required<number>();
  public shareds = input.required<number>();
  public id = input.required<string>();


  

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

    return this.likes() + offset;
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
}
