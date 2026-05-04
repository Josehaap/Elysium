import { Component, inject, signal } from '@angular/core';
import { PostCard } from "../../../post/components/post-card/post-card";
import { infoDataPost } from '../home-platform/models/home';
import { FormsModule } from '@angular/forms';
import { isEmpty } from 'rxjs';
import { AddApi } from './services/add-api';
import { SubmitPost } from './model/post';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/core/services/token-service';
import { Alert } from '../../../shared/alert/alert';

@Component({
    selector: 'app-add-platform',
    imports: [PostCard, FormsModule, Alert],
    templateUrl: './add-platform.html',
    styleUrl: './add-platform.css',
})
export class AddPlatform {
    protected addApi = inject(AddApi)
    protected router = inject(Router);
    protected selectedFile: File | null = null;
    
    public alertMessage = signal<string>('');
    public alertLevel = signal<string>('');

    protected infoPost = signal<infoDataPost>({
        post_id: '',
        title: '',
        description: '',
        img_post: '',
        created_at: new Date().toISOString(),
        user_id: '',
        username: TokenService.getUsenameToken(),
        profile_img: TokenService.getProfileImg(),
        likes: 0,
        comment: 0,
        shared: 0,
        userLike: false,
    });

    updateField(field: keyof infoDataPost, value: any) {
        this.infoPost.update(prev => ({ ...prev, [field]: value }));
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];
            this.selectedFile = file; // Guardamos el archivo real para el backend
            const imgURL = URL.createObjectURL(file);
            this.updateField('img_post', imgURL); // Guardamos la URL para la vista previa
        }
    }

    onSubmitPost() {
        const post = this.infoPost();
        
        if (post.title.length > 50 || post.description.length > 200) {
            this.alertLevel.set('danger');
            this.alertMessage.set('El título o la descripción son muy largos');
            setTimeout(() => this.alertMessage.set(''), 3000);
            return;
        }

        if (!this.selectedFile) {
            this.alertLevel.set('danger');
            this.alertMessage.set('No se puede subir un post sin imagen');
            setTimeout(() => this.alertMessage.set(''), 3000);
            return;
        }

        const { title, description, created_at } = post;
        const formData = new FormData();

        formData.append('title', title ?? '');
        formData.append('description_post', description ?? '');
        
        if (this.selectedFile) {
            formData.append('img_post', this.selectedFile); // Añadimos el archivo real al formData
        }

        formData.append('created_at', created_at ?? '');
        console.log(formData)
        this.addApi.submitPost(formData).subscribe({
            next: (resp) => {
                console.log('Post enviado:', resp);
                const username = TokenService.getUsenameToken();
                this.router.navigate(['elysium/profile', username]);
            },
            error: (err) => {
                console.error('Error al enviar:', err);
                this.alertLevel.set('danger');
                this.alertMessage.set(err.error?.Error || 'Hubo un error al crear la publicación.');
                setTimeout(() => this.alertMessage.set(''), 3000);
            }
        });
    }
}
