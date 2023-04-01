import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FlattenPokemon } from '../interfaces/pokemon.interface';

@Component({
  selector: 'app-pokemon-personal',
  standalone: true,
  imports: [NgTemplateOutlet],
  template:`
    <div class="pokemon-container" style="padding: 0.5rem;">
      <ng-container *ngTemplateOutlet="details; context: { $implicit: 'Id: ', value: pokemon.id }"></ng-container>
      <ng-container *ngTemplateOutlet="details; context: { $implicit: 'Name: ', value: pokemon.name }"></ng-container>
      <ng-container *ngTemplateOutlet="details; context: { $implicit: 'Height: ', value: pokemon.height }"></ng-container>
      <ng-container *ngTemplateOutlet="details; context: { $implicit: 'Weight: ', value: pokemon.weight }"></ng-container>
    </div>
    <ng-template #details let-name let-value="value">
      <label><span style="font-weight: bold; color: #aaa">{{ name }}</span>
        <span>{{ value }}</span>
      </label>
    </ng-template>
  `,
  styles: [`
    :host {
      display: block;
    }

    .pokemon-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonPersonalComponent {
  @Input()
  pokemon!: FlattenPokemon;
}
