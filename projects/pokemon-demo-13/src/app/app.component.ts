import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  standalone: true,
  template: `
    <ul>
      <li><a routerLink="/" routerLinkActive="active">Home</a></li>
      <li><a routerLink="/pokemon" routerLinkActive="active">Show Pokemon</a></li>
      <li><a routerLink="/bad" routerLinkActive="active">Bad route</a></li>
    </ul>
    <router-outlet></router-outlet>
  `,
  styles: [`
    :host {
      display:block;
    }

    ul {
      display: flex;
      padding: 0.5rem;
    }

    li {
      font-size: 1rem;
      margin-right: 0.25rem;
      list-style-type: none;
    }

    .active {
      color: green;
      font-weight: bold;
    }
  `]
})
export class AppComponent {
  title = 'Pokemon Demo 13';

  constructor(titleService: Title) {
    titleService.setTitle(this.title);
  }
}
