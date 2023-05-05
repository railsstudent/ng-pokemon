import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  standalone: true,
  template: `
    <div>
      <li><a routerLink="/" routerLinkActive="active">Home</a></li>
      <li><a routerLink="/pokemon" routerLinkActive="active">Show Pokemon</a></li>
      <li><a routerLink="/bad" routerLinkActive="active">Bad route</a></li>
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
