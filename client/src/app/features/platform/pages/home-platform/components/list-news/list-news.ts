import { Component } from '@angular/core';
import news from '../../mock/dataNews';

@Component({
  selector: 'app-list-news',
  imports: [],
  templateUrl: './list-news.html',
  styleUrl: './list-news.css',
})
export class ListNews {
  protected news = news;

}
