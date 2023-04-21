import { AsyncPipe, NgComponentOutlet, NgFor } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input, OnChanges, QueryList, SimpleChanges, ViewChildren, inject } from '@angular/core';
import { Observable, merge, startWith } from 'rxjs';
import { PokemonLinkDirective } from '../directives/pokemon-link.directive';
import { POKEMON_TAB } from '../enum/pokemon-tab.enum';
import { createPokemonInjectorFn } from '../injectors/pokemon.injector';
import { FlattenPokemon } from '../interfaces/pokemon.interface';
import { PokemonAbilitiesComponent } from '../pokemon-abilities/pokemon-abilities.component';
import { PokemonStatsComponent } from '../pokemon-stats/pokemon-stats.component';
import { DynamicComponents } from '../types/pokemon-tab.type';

@Component({
  selector: 'app-pokemon-tab',
  standalone: true,
  imports: [
    PokemonAbilitiesComponent,
    PokemonStatsComponent,
    NgComponentOutlet,
    NgFor,
    AsyncPipe,
    PokemonLinkDirective,
  ],
  template: `
    <div style="padding: 0.5rem;">
      <ul>
        <li><a href="#" appPokemonLink="ALL" [appPokemonLinkComponentMap]="componentMap">All</a></li>
        <li><a href="#" appPokemonLink="STATISTICS" [appPokemonLinkComponentMap]="componentMap">Stats</a></li>
        <li><a href="#" appPokemonLink="ABILITIES" [appPokemonLinkComponentMap]="componentMap">Abilities</a></li>
      </ul>
    </div>
    <ng-container *ngFor="let component of dynamicComponents$ | async">
      <ng-container *ngComponentOutlet="component; injector: myInjector"></ng-container>
    </ng-container>
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
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonTabComponent implements AfterViewInit, OnChanges {
  @Input()
  pokemon!: FlattenPokemon;

  @ViewChildren(PokemonLinkDirective)
  selections!: QueryList<PokemonLinkDirective>;

  componentMap = {
    [POKEMON_TAB.STATISTICS]: [PokemonStatsComponent],
    [POKEMON_TAB.ABILITIES]: [PokemonAbilitiesComponent],
    [POKEMON_TAB.ALL]: [PokemonStatsComponent, PokemonAbilitiesComponent],
  }

  createPokemonInjector = createPokemonInjectorFn();
  myInjector!: Injector;
  dynamicComponents$!: Observable<DynamicComponents>;
  markForCheck = inject(ChangeDetectorRef).markForCheck;

  ngAfterViewInit(): void {
    this.myInjector = this.createPokemonInjector(this.pokemon);
    this.markForCheck();

    this.dynamicComponents$ = merge(...this.selections.map(({ click$ }) => click$))
      .pipe(startWith(this.componentMap[POKEMON_TAB.ALL]));
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.myInjector = this.createPokemonInjector(changes['pokemon'].currentValue);
  }
}
