import { Component, inject, input, signal } from '@angular/core';
import { IMessage } from '../../models/message';
import { TokenService } from 'src/app/core/services/token-service';


@Component({
  selector: 'app-message',
  imports: [],
  templateUrl: './message.html',
  styleUrl: './message.css',
})
export class Message {
  //Cuando se carge el mensaje vamos a comprobar si el comentario procede del usuario o de otro usuario
 

  protected activeClassExpanded = signal<boolean>(false);
  public dataComment = input.required<IMessage>(); 
  protected isTheSameUSer = signal<boolean>(false); 
  
  ngOnInit(){
    this.isTheSameUSer.set(this.dataComment().username === TokenService.getUsenameToken()); 
  }
}
