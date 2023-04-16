import { AsyncPipe, NgComponentOutlet, NgFor } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Injector, Input, OnChanges, QueryList, SimpleChanges, ViewChildren, inject } from '@angular/core';
import { Observable, fromEvent, map, merge, startWith } from 'rxjs';
import { POKEMON_TAB } from '../enum/pokemon-tab.enum';
import { createPokemonInjectorFn } from '../injectors/pokemon.injector';
import { FlattenPokemon } from '../interfaces/pokemon.interface';
import { PokemonAbilitiesComponent } from '../pokemon-abilities/pokemon-abilities.component';
import { PokemonStatsComponent } from '../pokemon-stats/pokemon-stats.component';

type DynamicComponent = (typeof PokemonAbilitiesComponent | typeof PokemonStatsComponent)[];

@Component({
  selector: 'app-pokemon-tab',
  standalone: true,
  imports: [
    PokemonAbilitiesComponent,
    PokemonStatsComponent,
    NgComponentOutlet,
    NgFor,
    AsyncPipe
  ],
  template: `
    <div style="padding: 0.5rem;">
      <ul>
        <li><a href="#" #selection data-type="ALL">All</a></li>
        <li><a href="#" #selection data-type="STATISTICS">Stats</a></li>
        <li><a href="#" #selection data-type="ABILITIES">Abilities</a></li>
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
  `]
})
export class PokemonTabComponent implements AfterViewInit, OnChanges {
  @Input()
  pokemon!: FlattenPokemon;

  @ViewChildren('selection', { read: ElementRef })
  selections!: QueryList<ElementRef<HTMLLinkElement>>;

  componentMap = {
    [POKEMON_TAB.STATISTICS]: [PokemonStatsComponent],
    [POKEMON_TAB.ABILITIES]: [PokemonAbilitiesComponent],
    [POKEMON_TAB.ALL]: [PokemonStatsComponent, PokemonAbilitiesComponent],
  }

  createPokemonInjector = createPokemonInjectorFn();
  myInjector!: Injector;
  dynamicComponents$!: Observable<DynamicComponent>;
  markForCheck = inject(ChangeDetectorRef).markForCheck;

  ngAfterViewInit(): void {
    this.myInjector = this.createPokemonInjector(this.pokemon);
    this.markForCheck();

    const linkClicked$ = this.selections.map(({ nativeElement }) =>
      fromEvent(nativeElement, 'click').pipe(
        map(() => POKEMON_TAB[(nativeElement.dataset['type'] || 'ALL') as keyof typeof POKEMON_TAB]),
        map((selection) => this.componentMap[selection]),
      ),
    );

    this.dynamicComponents$ = merge(...linkClicked$)
      .pipe(startWith(this.componentMap[POKEMON_TAB.ALL]));
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.myInjector = this.createPokemonInjector(changes['pokemon'].currentValue);
  }
}
