import { Component } from '@angular/core';
import { PokemonComponent } from './pokemon/pokemon/pokemon.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PokemonComponent],
  template: '<app-pokemon></app-pokemon>',
  styles: [`
    :host {
      display: block;
    }
  `],
})
export class AppComponent {
  title = 'Pokemon Demo 11';

  constructor(titleService: Title) {
    titleService.setTitle(this.title);
  }
}
