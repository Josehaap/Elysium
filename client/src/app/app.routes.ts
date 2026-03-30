import { Routes } from '@angular/router';
import { Landingpage } from './features/landingpage/landingpage';
import { Home } from './features/landingpage/pages/home/home';
import { Login } from './features/landingpage/pages/login/login';
import { Platform } from './features/platform/platform';
import { HomePlatform } from './features/platform/pages/home-platform/home-platform';

export const routes: Routes = [
    {
        path: '',
        component: Landingpage,
        children: [
            {
                path: '',
                component: Home
            }, 
            {
                path:'login', 
                component:Login
            }
        ], 
    },
    {
        path: 'elysium', 
        component: Platform, 
        children:[
            {
                path: 'home/:id', 
                component: HomePlatform
            },
            {
                path: 'chat', 
                component: Home
            },
            {
                path: 'add', 
                component: Home
            },
            {
                path: 'search', 
                component: Home
            }
        ]
    },
    { path: '**', redirectTo: '' }
];
