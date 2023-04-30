import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { switchMap } from 'rxjs';
import { getPokemonId, retrievePokemonFn } from '../helpers/pokemon.http';
import { PokemonControlsComponent } from '../pokemon-controls/pokemon-control.component';
import { PokemonPersonalComponent } from '../pokemon-personal/pokemon-personal.component';
import { PokemonTabComponent } from '../pokemon-tab/pokemon-tab.component';

@Component({
  selector: 'app-pokemon',
  standalone: true,
  imports: [AsyncPipe, NgIf, PokemonControlsComponent, PokemonPersonalComponent, PokemonTabComponent],
  template: `
    <h2>
      Display the first 100 pokemon images (lazy load standalone component)
    </h2>
    <div>
      <ng-container *ngIf="pokemon$ | async as pokemon">
        <div class="container">
          <img [src]="pokemon.front_shiny" />
          <img [src]="pokemon.back_shiny" />
        </div>
        <app-pokemon-personal [pokemon]="pokemon"></app-pokemon-personal>
        <app-pokemon-tab [pokemon]="pokemon"></app-pokemon-tab>
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
