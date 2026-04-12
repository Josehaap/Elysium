import { Component, inject, signal } from '@angular/core';
import { ProfileApi } from './service/profile-api';
import { NgStyle } from '@angular/common';
import { Posts} from "src/app/features/platform/pages/profile-platform/components/posts/posts";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-platform',
  imports: [NgStyle, Posts, FormsModule],
  templateUrl: './profile-platform.html',
  styleUrl: './profile-platform.css',
})
export class ProfilePlatform {
  protected profileApi = inject(ProfileApi);

  // Estado para controlar si estamos editando
  public isEditing = signal(false);

  // Señal para almacenar temporalmente los datos editables
  public profileData = signal({
    name: '',
    description_user: ''
  });

  // Señal para la previsualización de la nueva imagen
  public profileImagePreview = signal<string | null>(null);

  /**
   * Cambia entre el modo edición y visualización.
   * Si entra en modo edición, copia los datos actuales de la API a la señal local.
   * Si sale de modo edición (Guardar), dispara la lógica de guardado.
   */
  public toggleEdit() {
    if (this.isEditing()) {
      this.saveChanges();
    } else {
      // Cargamos los datos actuales en el modo edición
      const current = this.profileApi.getProfileInfoUser.value()?.Data;
      if (current) {
        this.profileData.set({
          name: current.name,
          description_user: current.description_user
        });
      }
    }
    this.isEditing.set(!this.isEditing());
  }

  private saveChanges() {
    console.log("Guardando cambios:", this.profileData());
    // TODO: Implementar llamada al backend para guardar texto e imagen
  }

  /**
   * Maneja la selección de un nuevo archivo de imagen
   */
  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImagePreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  // Métodos auxiliares para ngModel con signals
  updateName(value: string) {
    this.profileData.update(prev => ({ ...prev, name: value }));
  }

  updateDescription(value: string) {
    this.profileData.update(prev => ({ ...prev, description_user: value }));
  }
}
