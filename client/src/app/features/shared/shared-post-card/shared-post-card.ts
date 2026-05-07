import { Component, Input, OnInit, inject, input, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TokenService } from 'src/app/core/services/token-service';
import { CommonModule } from '@angular/common';
import { SharedApi } from './services/shared-api';
import { infoDataPost } from '../../platform/pages/home-platform/models/home';
  
@Component({
  selector: 'app-shared-post-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shared-post-card.html',
  styleUrl: './shared-post-card.css',
})
export class SharedPostCard {
  public postId = input.required<string>();
  protected post = signal<infoDataPost | null >(null);
  protected loading = signal(true);
  protected sharedApi = inject(SharedApi);
  ngOnInit() {
    this.sharedApi.getPost(this.postId()).subscribe({
      next: (res) => {
        if (res.Success) {
          this.post.set(res.Data);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  getImgUrl(path: string): string {
    if (!path) return 'img/placeholder/publish/publish.webp';
    if (path.startsWith('http')) return path;
    return `${environment.apiUrl}/${path}`;
  }
}
