import { Component, Inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../template/header/header.component';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, RouterModule, RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const sectionId = params['scrollTo'];
      if (sectionId) {
        setTimeout(() => {
          this.scrollToElement(sectionId);
        }, 0);
      }
    });
  }

  private scrollToElement(id: string) {
    const element = this.document.getElementById(id);
    const headerOffset = 80;

    if (element) {
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }
}
