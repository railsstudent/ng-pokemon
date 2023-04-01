import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { switchMap } from 'rxjs';
import { getPokemonId, retrievePokemonFn } from '../helpers/pokemon.http';
import { PokemonAbilitiesComponent } from '../pokemon-abilities/pokemon-abilities.component';
import { PokemonControlsComponent } from '../pokemon-controls/pokemon-control.component';
import { PokemonPersonalComponent } from '../pokemon-personal/pokemon-personal.component';
import { PokemonStatsComponent } from '../pokemon-stats/pokemon-stats.component';

@Component({
  selector: 'app-pokemon',
  standalone: true,
  imports: [AsyncPipe, NgIf, PokemonControlsComponent, PokemonAbilitiesComponent, PokemonStatsComponent, PokemonPersonalComponent],
  template: `
    <h1>
      Display the first 100 pokemon images
    </h1>
    <div>
      <ng-container *ngIf="pokemon$ | async as pokemon">
        <div class="container">
          <img [src]="pokemon.front_shiny" />
          <img [src]="pokemon.back_shiny" />
        </div>
        <app-pokemon-personal [pokemon]="pokemon"></app-pokemon-personal>
        <app-pokemon-stats [pokemon]="pokemon"></app-pokemon-stats>
        <app-pokemon-abilities [pokemon]="pokemon"></app-pokemon-abilities>
      </ng-container>
    </div>
    <app-pokemon-controls></app-pokemon-controls>
  `,
  styles: [`
    :host {
      display: block;
      font-size: 1.5rem;
      padding: 1rem;
    }

    h1 {
      margin-bottom: 20px;
    }

    .container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      padding: 1rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonComponent {
  retrievePokemon = retrievePokemonFn();
  pokemon$ = getPokemonId().pipe(switchMap((id) => this.retrievePokemon(id)));
}
