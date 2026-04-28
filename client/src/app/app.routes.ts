import { CanActivate, Routes } from '@angular/router';
import { Landingpage } from './features/landingpage/landingpage';
import { Home } from './features/landingpage/pages/home/home';
import { Login } from './features/landingpage/pages/login/login';
import { Platform } from './features/platform/platform';
import { authGuard } from './core/guards/token-guard';
//!Exportar las rutas ha archivos independientes
export const routes: Routes = [
  {
    path: '',
    component: Landingpage,
    children: [
      {
        path: '',
        component: Home,
      },
      {
        path: 'login',
        component: Login,
      },
    ],
  },
  {
    path: 'elysium',
    component: Platform,
    canActivate: [authGuard], //Comprobaremos que está el token almacenado.
    children: [
      {
        path: 'home',
        loadComponent:()=> import('./features/platform/pages/home-platform/home-platform').then(m => m.HomePlatform),
       
      },
      {
        path: 'chat',
        loadComponent:()=> import('./features/platform/pages/chat-platform/chat-platform').then(m => m.ChatPlatform),
      },
      {
        path: 'add',
        loadComponent:()=> import('./features/platform/pages/add-platform/add-platform').then(m=>m.AddPlatform),
      },
      {
        path: 'search',
        loadComponent:()=> import('./features/platform/pages/search-platform/search-platform').then(m=>m.SearchPlatform),
      },
      {
        path: 'profile/:username',
        loadComponent:()=> import('./features/platform/pages/profile-platform/profile-platform').then(m=>m.ProfilePlatform),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
