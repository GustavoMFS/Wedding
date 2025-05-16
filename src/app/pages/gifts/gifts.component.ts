import { Component } from '@angular/core';
import { HeaderComponent } from '../../template/header/header.component';

@Component({
  selector: 'app-gifts',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './gifts.component.html',
  styleUrl: './gifts.component.scss',
})
export class GiftsComponent {}
