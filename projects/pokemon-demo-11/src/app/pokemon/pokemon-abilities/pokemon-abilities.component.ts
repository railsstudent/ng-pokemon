import { NgFor, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FlattenPokemon } from '../interfaces/pokemon.interface';

@Component({
  selector: 'app-pokemon-abilities',
  standalone: true,
  imports: [NgFor, NgTemplateOutlet],
  template: `
    <div style="padding: 0.5rem;">
      <p>Abilities</p>
      <div *ngFor="let ability of pokemon.abilities" class="abilities-container">
        <ng-container *ngTemplateOutlet="abilities; context: { $implicit: ability.name, isHidden: ability.is_hidden }"></ng-container>
      </div>
    </div>
    <ng-template #abilities let-name let-isHidden="isHidden">
      <label><span style="font-weight: bold; color: #aaa">Name: </span>
        <span>{{ name }}</span>
      </label>
      <label><span style="font-weight: bold; color: #aaa">Is hidden? </span>
        <span>{{ isHidden ? 'Yes' : 'No' }}</span>
      </label>
    </ng-template>  
  `,
  styles: [`
    :host {
      display: block;
    }

    .abilities-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }

    .abilities-container > * {
      flex-grow: 1;
      flex-basis: calc(100% / 2);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonAbilitiesComponent {
  @Input()
  pokemon!: FlattenPokemon;
}
