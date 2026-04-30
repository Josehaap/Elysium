import { Component, EventEmitter, Input, Output, inject, signal, computed } from '@angular/core';
import { ChatApi } from '../../platform/pages/chat-platform/services/chat-api';
import { ChatPreview } from '../../platform/pages/chat-platform/models/chat';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-share-post-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './share-post-modal.html',
  styleUrl: './share-post-modal.css'
})
export class SharePostModal {
  private chatApi = inject(ChatApi);

  @Input() postId!: string;
  @Output() close = new EventEmitter<void>();
  @Output() shared = new EventEmitter<string>(); // Emit chat_id when shared

  protected chatList = computed(() => {
    const res = this.chatApi.getChatList.value() as any;
    return res?.Success ? res.Data as ChatPreview[] : [];
  });

  getProfileImgUrl(profileImg: string | null): string {
    if (!profileImg || profileImg === '') {
      return 'img/placeholder/profile/profile_userDefault.webp';
    }
    if (profileImg.startsWith('http') || profileImg.startsWith('blob')) {
      return profileImg;
    }
    return `${environment.apiUrl}/${profileImg}`;
  }

  shareWith(chatId: string) {
    this.shared.emit(chatId);
  }
}
