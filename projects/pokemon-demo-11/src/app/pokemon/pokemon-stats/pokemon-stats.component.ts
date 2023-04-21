import { NgFor, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { POKEMON_TOKEN } from '../constants/pokemon.constant';
import { FlattenPokemon } from '../interfaces/pokemon.interface';

@Component({
  selector: 'app-pokemon-stats',
  standalone: true,
  imports: [NgFor, NgTemplateOutlet],
  template: `
    <div style="padding: 0.5rem;">
      <p>Stats</p>
      <div *ngFor="let stat of pokemon.stats" class="stats-container">
        <ng-container *ngTemplateOutlet="stats; context: { $implicit: stat.name, effort: stat.effort, baseStat: stat.base_stat }"></ng-container>
      </div>
    </div>
    <ng-template #stats let-name let-baseStat="baseStat" let-effort="effort">
      <label><span style="font-weight: bold; color: #aaa">Name: </span>
        <span>{{ name }}</span>
      </label>
      <label><span style="font-weight: bold; color: #aaa">Base Stat: </span>
        <span>{{ baseStat }}</span>
      </label>
      <label><span style="font-weight: bold; color: #aaa">Effort: </span>
        <span>{{ effort }}</span>
      </label>
    </ng-template>
  `,
  styles: [`
    :host {
      display: block;
    }

    .stats-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }

    .stats-container > * {
      flex-grow: 1;
      flex-basis: calc(100% / 3);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonStatsComponent {
  @Input()
  pokemon!: FlattenPokemon;
}
