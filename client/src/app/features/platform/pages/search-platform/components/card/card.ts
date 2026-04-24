import { Component, computed, inject, input } from '@angular/core';
import { DataUser } from '../../models/search-platform';
import { btnFollow } from "src/app/features/shared/btnFollow/btnFollow";
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-card',
  imports: [btnFollow],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  private router = inject(Router);  

  public infoCard = input.required<DataUser>();

  goToProfile = (username:string)=>{
    this.router.navigate([`elysium/profile/${username}`]);
  }

  protected urlImg = computed(()=>{
    let img = this.infoCard().profile_img; 
    if(img === '') img = 'img/placeholder/profile/profile_userDefault.webp'; 
    else if (img.startsWith('http') || img.startsWith('blob')) return img; 
    else {
      img = `${environment.apiUrl}/${img}`; 
    }

    return img; 
  });
}
