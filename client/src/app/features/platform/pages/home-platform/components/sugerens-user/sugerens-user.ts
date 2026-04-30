import { Component, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HomeApi } from '../../services/home-api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sugerens-user',
  imports: [CommonModule],
  templateUrl: './sugerens-user.html',
  styleUrl: './sugerens-user.css',
})
export class SugerensUser {
  protected homeApi = inject(HomeApi);
  protected apiUrl = environment.apiUrl;

  follow(username: string) {
    this.homeApi.followUser(username).subscribe({
      next: () => {
        // Recargar la información de seguidos en el padre (HomePlatform)
        // para que desaparezca la lista de sugerencias si ya sigue a alguien
        this.homeApi.getNumberFollowed.reload();
        // También recargar el dashboard para traer los posts del nuevo seguido
        this.homeApi.getDashboardInfo.reload();
      },
      error: (err) => {
        console.error('Error al seguir al usuario:', err);
      },
    });
  }

  getImgUrl(profileImg: string): string {
    if (!profileImg) return 'assets/img/default-avatar.png';

    // Si ya es una URL completa (http o https), la devolvemos tal cual
    if (profileImg.startsWith('http')) return profileImg;

    // Si no empieza por '/', se lo añadimos para que la concatenación sea correcta
    const path = profileImg.startsWith('/') ? profileImg : `/${profileImg}`;
    return `${this.apiUrl}${path}`;
  }
}
