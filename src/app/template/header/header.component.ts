import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  menuOpen = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router
  ) {}

  ngOnInit() {
    if (window.innerWidth >= 768) {
      this.menuOpen = false;
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  scrollToSection(id: string) {
    const currentUrl = this.router.url.split('?')[0];

    if (currentUrl === '/home') {
      // Se estiver na home, faz scroll direto
      this.scrollToElement(id);
      this.closeMenu();
    } else {
      // Se estiver em outra rota (ex: /home/presentes), navega para home com query param
      this.router.navigate(['/home'], { queryParams: { scrollTo: id } });
      this.closeMenu();
    }
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

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const width = (event.target as Window).innerWidth;
    if (width >= 768 && this.menuOpen) {
      this.menuOpen = false;
    }
  }
}
