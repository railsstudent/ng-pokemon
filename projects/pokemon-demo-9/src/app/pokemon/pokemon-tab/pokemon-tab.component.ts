import { Component, Input } from '@angular/core';
import { FlattenPokemon } from '../interfaces/pokemon.interface';
import { PokemonAbilitiesComponent } from '../pokemon-abilities/pokemon-abilities.component';
import { PokemonStatsComponent } from '../pokemon-stats/pokemon-stats.component';

@Component({
  selector: 'app-pokemon-tab',
  standalone: true,
  imports: [PokemonAbilitiesComponent, PokemonStatsComponent],
  template: `
    <div style="padding: 0.5rem;">
      <ul>
        <li><a href="#" data-type="all">All</a></li>
        <li><a href="#" data-type="statistics">Stats</a></li>
        <li><a href="#" data-type="abilities">Abilities</a></li>
      </ul>
    </div>
    <app-pokemon-abilities [pokemon]="pokemon"></app-pokemon-abilities>
    <app-pokemon-stats [pokemon]="pokemon"></app-pokemon-stats>
  `,
  styles: [`
    li {
      list-style-type: none;
    }

    ul {
      display: flex;

      li {
        flex-grow: 1;
        flex-shrink: 1;
        flex-basis: calc(100% / 3);
      }
    }
  `]
})
export class PokemonTabComponent {
  @Input()
  pokemon!: FlattenPokemon;
}
