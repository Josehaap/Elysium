import { CanActivate, Routes } from '@angular/router';
import { Landingpage } from './features/landingpage/landingpage';
import { Home } from './features/landingpage/pages/home/home';
import { Login } from './features/landingpage/pages/login/login';
import { Platform } from './features/platform/platform';
import { HomePlatform } from './features/platform/pages/home-platform/home-platform';
import { authGuard } from './core/guards/token-guard';
import { ProfilePlatform } from './features/platform/pages/profile-platform/profile-platform';
import { SearchPlatform } from './features/platform/pages/search-platform/search-platform';
import { AddPlatform } from './features/platform/pages/add-platform/add-platform';
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
        component: HomePlatform,
      },
      {
        path: 'chat',
        component: Home,
      },
      {
        path: 'add',
        component: AddPlatform,
      },
      {
        path: 'search',
        component: SearchPlatform,
      },
      {
        path: 'profile/:username',
        component: ProfilePlatform,
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
