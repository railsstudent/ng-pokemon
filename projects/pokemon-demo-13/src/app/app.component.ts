import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink],
  standalone: true,
  template: `
    <div>
      <ul>
        <li><a routerLink="/pokemon" routerLinkActive="active" ariaCurrentWhenActive="page">Pokemon</a></li>
      </ul>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AppComponent {
  title = 'Pokemon Demo 13';

  constructor(titleService: Title) {
    titleService.setTitle(this.title);
  }
}
