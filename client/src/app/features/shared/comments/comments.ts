import { Component, computed, inject, input, output, signal } from '@angular/core';
import { ListMessage } from './components/list-message/list-message';
import { CommentApi } from './services/comments-api';
import { CommentAction, CommentEvent } from './models/message';

@Component({
  selector: 'app-comments',
  imports: [ListMessage],
  templateUrl: './comments.html',
  styleUrl: './comments.css',
})
export class Comments {
  protected CommentAction = CommentAction;
  protected commenApi = inject(CommentApi)
  public id = input.required<string>(); 
  public onCommentAction = output<CommentEvent>();

  protected commentsResource = this.commenApi.getComents(this.id);

   
  protected insertComment (event:Event){
    const input = event.target as HTMLInputElement;
    if (!input.value.trim()) return;
    
    this.commenApi.insertComment(this.id(), input.value).subscribe({
      next:()=>{
        input.value = '';
        this.onCommentAction.emit({ action: CommentAction.ADDED, message: input.value });
        this.commentsResource.reload();
      }
    })
  }
}
