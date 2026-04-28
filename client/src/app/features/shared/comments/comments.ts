import { Component } from '@angular/core';
import { ListMessage } from './components/list-message/list-message';

@Component({
  selector: 'app-comments',
  imports: [ListMessage],
  templateUrl: './comments.html',
  styleUrl: './comments.css',
})
export class Comments {

}
