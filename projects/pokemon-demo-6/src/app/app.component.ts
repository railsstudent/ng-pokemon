import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PokemonComponent } from './pokemon/pokemon/pokemon.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PokemonComponent],
  template: '<app-pokemon></app-pokemon>',
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AppComponent {
  constructor(titleService: Title) {
    const title = 'Pokemon Demo 6';

    titleService.setTitle(title);
  }
}
