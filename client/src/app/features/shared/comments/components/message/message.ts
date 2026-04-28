import { Component, input, signal } from '@angular/core';
import { IMessage } from '../../models/message';

@Component({
  selector: 'app-message',
  imports: [],
  templateUrl: './message.html',
  styleUrl: './message.css',
})
export class Message {
  protected activeClassExpanded = signal<boolean>(false);
  public dataComment = input.required<IMessage>(); 
}
