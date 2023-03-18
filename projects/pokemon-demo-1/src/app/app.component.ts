import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PokemonComponent } from './pokemon/pokemon/pokemon.component';

@Component({
  selector: 'app-root',
  imports: [PokemonComponent],
  standalone: true,
  template: '<app-pokemon></app-pokemon>',
  styles:[`
    :host {
      display: block;
    }
  `]
})
export class AppComponent {
  constructor(titleService: Title) {
    const title = 'Pokemon Demo 1';
    titleService.setTitle(title);
  }
}
