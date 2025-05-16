import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Verifica se está rodando no navegador
  if (typeof window !== 'undefined') {
    const validPW = localStorage.getItem('validPW');
    if (validPW === 'true') {
      return true;
    }
  }

  router.navigate(['/']);
  return false;
};
