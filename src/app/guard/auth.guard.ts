import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const validPW = localStorage.getItem('validPW');
  if (validPW === 'true') {
    return true;
  } else {
    const router = inject(Router);
    router.navigate(['/']);
    return false;
  }
};
