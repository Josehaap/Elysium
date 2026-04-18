import { Component, inject, signal, linkedSignal, input,  } from '@angular/core';
import { environment } from 'src/environments/environment';
import { jwtDecode } from 'jwt-decode';
import { TokenService } from 'src/app/core/services/token-service';
import { accessToken } from 'src/app/features/shared/models/shared';
import { btnFollowApi } from './service/btnFollow-api';

@Component({
  selector: 'app-btnFollow',
  imports: [],
  templateUrl: './btnFollow.html',
  styleUrl: './btnFollow.css',
  providers: [btnFollowApi]
})

export class btnFollow {
  ngOnInit(){
    this.btnFollowApi.username.set(this.username());
  }
  private btnFollowApi = inject(btnFollowApi);

  public username  = input.required<string>();

  protected isFollowed = linkedSignal({
    source:()=> {
      return this.btnFollowApi.iAmFollow.value()
    }, 
    computation: (source)=>{  
      return source ?? false
    } 
  });

  //Función par aimplementar el seguir a un usuario. 
  protected followUser(){
    this.btnFollowApi.insertFollow(this.username()).subscribe({
      next:(resp:any)=>{
        this.isFollowed.set(resp);
      }, 
      error: (err)=>{
        console.error(err.message)
      }
    })
  }
}
