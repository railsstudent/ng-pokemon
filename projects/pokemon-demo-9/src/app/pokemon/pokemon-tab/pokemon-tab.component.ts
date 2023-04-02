import { AsyncPipe, NgComponentOutlet, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Injector, Input, OnChanges, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { Observable, fromEvent, map, merge, startWith } from 'rxjs';
import { FlattenPokemon } from '../interfaces/pokemon.interface';
import { PokemonAbilitiesComponent } from '../pokemon-abilities/pokemon-abilities.component';
import { PokemonStatsComponent } from '../pokemon-stats/pokemon-stats.component';
import { POKEMON_TAB } from './enums/pokemon-tab.enum';
import { createPokemonInjectorFn } from './injectors/pokemon.injector';

type DynamicComponent = (typeof PokemonAbilitiesComponent | typeof PokemonStatsComponent)[];

@Component({
  selector: 'app-pokemon-tab',
  standalone: true,
  imports: [
    PokemonAbilitiesComponent, 
    PokemonStatsComponent, 
    NgComponentOutlet, 
    NgIf, 
    NgFor, 
    AsyncPipe
  ],
  template: `
    <div style="padding: 0.5rem;">
      <ul>
        <li><a href="#" #selection data-type="all">All</a></li>
        <li><a href="#" #selection data-type="statistics">Stats</a></li>
        <li><a href="#" #selection data-type="abilities">Abilities</a></li>
      </ul>
    </div>
    <ng-container *ngIf="dynamicComponents$ | async as dynamicComponents">
      <ng-container *ngFor="let component of dynamicComponents">
        <ng-container *ngComponentOutlet="component; injector: myInjector"></ng-container>
      </ng-container>
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
  `]
})
export class PokemonTabComponent implements AfterViewInit, OnChanges {
  @Input()
  pokemon!: FlattenPokemon;

  @ViewChildren('selection', { read: ElementRef })
  selections!: QueryList<ElementRef<HTMLLinkElement>>;

  PokemonAbilitiesComponent = PokemonAbilitiesComponent;
  PokemonStatsComponent = PokemonStatsComponent;

  createPokemonInjector = createPokemonInjectorFn();
  myInjector!: Injector;
  dynamicComponents$!: Observable<DynamicComponent>;


  private getComponents(selection: POKEMON_TAB) {
    if (selection === POKEMON_TAB.STATISTICS) {
      return [PokemonStatsComponent];
    } else if (selection === POKEMON_TAB.ABILITIES) {
      return [PokemonAbilitiesComponent];         
    }
    return [
      PokemonStatsComponent,
      PokemonAbilitiesComponent
    ];
  }

  ngAfterViewInit(): void {
    this.myInjector = this.createPokemonInjector(this.pokemon);
    const linkClicked$ = this.selections.map(({ nativeElement }) => 
      fromEvent(nativeElement, 'click').pipe(map(() => 
        POKEMON_TAB[nativeElement.dataset['type'] as keyof typeof POKEMON_TAB] || POKEMON_TAB.STATISTICS))
    );

    this.dynamicComponents$ = merge(...linkClicked$)
      .pipe(
        map((selection) => this.getComponents(selection)),
        startWith(this.getComponents(POKEMON_TAB.ALL))
      );
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.myInjector = this.createPokemonInjector(changes['pokemon'].currentValue);
  }
}
