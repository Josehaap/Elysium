import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token-service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  //!Verificar que el token es válido intentando desencriptarla en el backend: 
  
  if (!TokenService.getToken()) {
    router.navigate(['/login']); // redirige si no está logueado
    return false;
  }
  return true; // permite acceso
}