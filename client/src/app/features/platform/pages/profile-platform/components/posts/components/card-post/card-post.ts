import { Component, computed, inject, input, signal } from '@angular/core';
import { NgStyle } from '@angular/common';
import { CardActions } from 'src/app/features/post/components/post-card/card-actions/card-actions';
import { Post } from 'src/app/features/platform/pages/profile-platform/models/profile';
import { environment } from 'src/environments/environment';
import { PostApi } from '../../services/post-api';
import { ActivatedRoute } from '@angular/router';
import { TokenService } from 'src/app/core/services/token-service';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-card-post',
  imports: [NgStyle, CardActions, FormsModule],
  templateUrl: './card-post.html',
  styleUrl: './card-post.css',
})
export class CardPost {
  private urlProfile = inject(ActivatedRoute);
  ngOnInit() {
    this.urlProfile.params.subscribe((params) => {
      console.log(params['username']);
      this.isUserOrVisit.set(TokenService.getUsenameToken() === params['username']);
    });
  }
  protected isUserOrVisit = signal<boolean>(false);
  protected apiPost = inject(PostApi);
  protected sendDelete() {
    this.urlProfile.params.subscribe((params) => {
      this.apiPost.deleteProfile(params['username'], this.infoPost().id).subscribe({
        next: (res) => {
          console.log(res);
          console.log('todo correcto');
          window.location.reload();
        },
        error: (res) => {
          console.log(res);
          console.log('todo mal');
          window.location.reload();
        },
      });
    });
  }
  public infoPost = input.required<Post>();

  protected isEditing = signal(false);
  protected editTitle = signal('');
  protected editDescription = signal('');

  protected openEdit() {
    this.editTitle.set(this.infoPost().title);
    this.editDescription.set(this.infoPost().description);
    this.isEditing.set(true);
    this.viewOptions.set(false); // Cierra el menú de opciones
  }

  protected saveEdit() {
    this.apiPost.updatePost(this.infoPost().id, this.editTitle(), this.editDescription()).subscribe({
      next: (res) => {
        if (res.Success) {
          window.location.reload();
        }
      },
      error: (err) => console.error(err)
    });
  }

  public imageUrl = computed(() => {
    const urlImg = this.infoPost().img;
    if (!urlImg || urlImg === '') return 'img/placeholder/publish/publish.webp';

    if (!urlImg.startsWith('http') && !urlImg.startsWith('blob')) {
      return new URL(urlImg, environment.apiUrl).toString();
    }
    return urlImg;
  });

  protected viewOptions = signal<boolean>(false);
}
