import { Component, computed, inject, linkedSignal, input, signal, model } from '@angular/core';
import { SearchApi } from './services/search-api';
import { btnFollow } from 'src/app/features/shared/btnFollow/btnFollow';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/core/services/token-service';
import { ListCard } from "./components/list-card/list-card";
import { SearchPlatformAPIResponse } from './models/search-platform';

@Component({
  selector: 'app-search-platform',
  imports: [ListCard],
  templateUrl: './search-platform.html',
  styleUrl: './search-platform.css',
})
export class SearchPlatform {
  protected searchApi = inject(SearchApi);
  
  public searchUserData = model<SearchPlatformAPIResponse | null>(null);
  public mostrar = linkedSignal(() => !!this.searchUserData());

  protected onSearchUser = (event :Event)=> {
    const input = event.target as HTMLInputElement; 
    if(input.value.length === 0) return this.searchUserData.set(null);

    this.searchApi.getUserSameLike(input.value).subscribe({
      next: (data)=>{
        this.searchUserData.set(data);
      }
    });
  }

}
