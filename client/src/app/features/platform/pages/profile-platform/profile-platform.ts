import { Component, inject, signal, linkedSignal } from '@angular/core';
import { ProfileApi } from './service/profile-api';
import { Posts } from 'src/app/features/platform/pages/profile-platform/components/posts/posts';
import { FormsModule } from '@angular/forms';
import { ModalProfileData } from './models/profile';
import { Options } from './components/options/options';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { TokenService } from 'src/app/core/services/token-service';
import { accessToken } from 'src/app/features/shared/models/shared';
import { btnFollow } from 'src/app/features/shared/btnFollow/btnFollow';
import { ChatApi } from '../chat-platform/services/chat-api';

@Component({
  selector: 'app-profile-platform',
  imports: [Posts, FormsModule, Options, btnFollow, RouterLink],
  templateUrl: './profile-platform.html',
  styleUrl: './profile-platform.css',
})
export class ProfilePlatform {
  
  //Injectamos los servicios
  protected profileApi = inject(ProfileApi);
  private urlProfile = inject(ActivatedRoute);
  private router = inject(Router);
  protected imgUrlOption = TokenService.getProfileImg();
  //Atributo que determinará que el usuario que haya entrado al perfil sea igual o no al usuario logueado.
  protected isUserOrVisit: boolean = false;
  //Atributo que servirá para almacenar el username del usuario que venga de la url.
  protected usernameURL: string = '';
  // Inyección del servicio de chat para iniciar conversaciones
  private chatApi = inject(ChatApi);
  //Comrpobamos que existe un chat 
  protected existChat = signal<boolean>(false); 


  //*Cuando se inicie el componente vamos a comprobar que el usuario sea el usuario o sea una persona distinta.
  ngOnInit() {
    this.urlProfile.params.subscribe((params) => {
      const token: accessToken = jwtDecode(TokenService.getToken());
      this.usernameURL = params['username'];
      this.profileApi.usernameUrl.set(params['username']);
      this.isUserOrVisit = this.usernameURL === token['username']; 
    });
  }

  
  protected profileData = linkedSignal({
    source: () => this.profileApi.getProfileInfoUser.value()?.Data,
    computation: (source) => {
      let urlMapeada: string = '';
      if (!source) return undefined;
      //* Vamos a comprobar que exista y que  no sea una url válida
      if (source.urlImg === '') urlMapeada = 'img/placeholder/profile/profile_userDefault.webp'
      else if(source.urlImg && !source.urlImg.startsWith('http') && !source.urlImg.startsWith('blob')) {
        urlMapeada = new URL(source.urlImg, environment.apiUrl).toString(); //Contruimos una nueva url válida apuntando a nuestro servidor ya sea en local o en producción
      } else urlMapeada = source.urlImg;
      return {
        ...source, //Pasamos todos los datos y vamos a formatear la url qque nos llega:
        urlImg: urlMapeada,
      };
    },
  });

  protected isEditing = signal(false);

  public modalData = signal<ModalProfileData>({
    name: '',
    surname: '',
    description_user: '',
    urlImg: '',
    numberFollower: '',
  });

  //Método que me permitirña actualizar el modalData cuando lo vaya a cambiar
  protected updateField(field: string, newValue: string) {
    this.modalData.update((prev) => {
      return {
        ...prev, //Copiamos todos los valores que estuvieran en el signal
        [field]: newValue, //sobreescribimos unicamente el campo especificado.
      };
    });
  }

  protected showForm() {
    //Lo primero que haces es actualizar is editing
    this.isEditing.set(!this.isEditing());
    //Luego comprobamos que vamos hacer
    if (this.isEditing()) {
      //Si es true significa que tendremos que actualizar modalData con la información de la señal
      //para que así se muestre en lso inputs
      this.modalData.set({
        name: this.profileData()?.name || '',
        surname: this.profileData()?.surname || '',
        description_user: this.profileData()?.description_user || '',
        urlImg: this.profileData()?.urlImg || '',
      });
    } else {
      //Actualizamos nuestro señalComputada
      this.profileData.set({
        ...this.profileData()!,
        name: this.modalData().name,
        surname: this.modalData().surname,
        description_user: this.modalData().description_user,
        urlImg: this.modalData()?.urlImg || '',
      });

      //Una vez la actualizacion de los datos se hayan hecho hacemos una peticion de actualizacion
      //Primero peparamo los datos generando un formData por el tema de la imagen:
      const formData = new FormData();
      formData.append('name', this.profileData()?.name || '');
      formData.append('surname', this.profileData()?.surname || '');
      formData.append('description_user', this.profileData()?.description_user || '');
      formData.append('username', this.profileData()?.username || '');

      if (this.modalData().profile_img_file) {
        formData.append('profile_img', this.modalData().profile_img_file!);
        console.log(this.modalData().profile_img_file)
      }
      //Lanzamos la consulta
      this.profileApi.updateProfileInfo(formData, this.usernameURL);
    }
  }

  onFileSelected(event: Event) {
    //Obtenemos el archivo
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0]; //Obtenemos la informacion total del archivo
      const imgURL = URL.createObjectURL(file); //Creamos una url temporal para visualiazr el archivo;
      this.modalData.update((prev) => ({
        ...prev,
        urlImg: imgURL,
        profile_img_file: file,
      }));
    }
  }

  protected menuInVisible = signal(true);

   public goToProfile() {
    this.router.navigate([`elysium/profile/${TokenService.getUsenameToken()}`]);
    //Actualizamos nuestro señalComputada
      this.modalData.set({
        name: this.profileApi.getProfileInfoUser.value()?.Data.name || '',
        surname: this.profileApi.getProfileInfoUser.value()?.Data.surname|| '',
        description_user: this.profileApi.getProfileInfoUser.value()?.Data.description_user || '',
        urlImg: this.profileApi.getProfileInfoUser.value()?.Data.urlImg|| '',
      });

      this.menuInVisible.set(!this.menuInVisible())
      this.showForm();
  }

  /**
   * Inicia una conversación con el usuario del perfil.
   * Llama al endpoint /chat/start y luego navega a la página de chat.
   */
  startChatWithUser() {
    const targetUserId = this.profileData()?.user_id;
    if (!targetUserId) return;

    this.chatApi.startChat(targetUserId).subscribe({
      next: () => {
        this.router.navigate(['/elysium/chat']);
      },
      error: (err) => {
        console.error('Error al iniciar el chat:', err);
      },
    });
  }

  protected createChat(){
    this.profileApi.updateChat().subscribe({
      next: (res)=>{
        this.router.navigate(['elysium/chat'])
      }
    })
  }
  protected goToChat =() => this.router.navigate(['elysium/chat'])

  public logout = () => {
    TokenService.logout();
    window.location.reload();
  };
}
