import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './guard/auth.guard';
import { GiftsComponent } from './pages/gifts/gifts.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
    children: [],
  },
  {
    path: 'home/presentes',
    component: GiftsComponent,
    canActivate: [authGuard],
    children: [],
  },
  { path: '**', redirectTo: '' },
];
