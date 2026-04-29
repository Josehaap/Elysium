import { Component, input, output } from '@angular/core';
import { Message } from "../message/message";
import { IMessage } from "../../models/message";


@Component({
  selector: 'app-list-message',
  imports: [Message],
  templateUrl: './list-message.html',
  styleUrl: './list-message.css',
})
export class ListMessage {
  public listMessage = input.required<IMessage[]>(); 
  public onDelete = output<void>();
}
