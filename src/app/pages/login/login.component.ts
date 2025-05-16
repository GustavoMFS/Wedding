import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  password = '';
  error = false;
  correctPW = '1';

  constructor(private router: Router) {}

  verifyPW() {
    if (this.password === this.correctPW) {
      localStorage.setItem('validPW', 'true');
      this.router.navigate(['/home']);
    } else {
      this.error = true;
    }
  }
}
