import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TokenService } from 'src/app/core/services/token-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shared-post-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (post()) {
      <div class="shared-post-card">
        <img [src]="getImgUrl(post().img_post)" alt="Post image" class="post-img">
        <div class="post-info">
          <p class="post-title">{{ post().title }}</p>
          <p class="post-desc">{{ post().description_post }}</p>
        </div>
      </div>
    } @else if (loading()) {
      <div class="shared-post-card loading">
        <div class="skeleton"></div>
      </div>
    }
  `,
  styles: [`
    .shared-post-card {
      background: #f0f0f0;
      border-radius: 12px;
      overflow: hidden;
      width: 200px;
      margin-top: 5px;
      border: 1px solid #ddd;
      cursor: pointer;
    }
    .post-img {
      width: 100%;
      height: 120px;
      object-fit: cover;
    }
    .post-info {
      padding: 8px;
    }
    .post-title {
      font-weight: 600;
      font-size: 0.9rem;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .post-desc {
      font-size: 0.8rem;
      color: #666;
      margin: 2px 0 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .loading {
      height: 180px;
      background: #eee;
    }
    .skeleton {
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }
    @keyframes loading {
      from { background-position: 200% 0; }
      to { background-position: -200% 0; }
    }
  `]
})
export class SharedPostCard implements OnInit {
  @Input() postId!: string;
  
  private http = inject(HttpClient);
  protected post = signal<any>(null);
  protected loading = signal(true);

  ngOnInit() {
    this.fetchPost();
  }

  fetchPost() {
    const headers = new HttpHeaders({
      accessToken: TokenService.getToken(),
      post_id: this.postId
    });

    this.http.get<any>(`${environment.apiUrl}/post/getPost`, { headers }).subscribe({
      next: (res) => {
        if (res.Success) {
          this.post.set(res.Data);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getImgUrl(path: string): string {
    if (!path) return 'img/placeholder/publish/publish.webp';
    if (path.startsWith('http')) return path;
    return `${environment.apiUrl}/${path}`;
  }
}
