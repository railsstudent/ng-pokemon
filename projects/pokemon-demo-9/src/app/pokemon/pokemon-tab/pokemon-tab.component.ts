import { AsyncPipe, NgComponentOutlet, NgFor } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Injector, Input, OnChanges, QueryList, SimpleChanges, ViewChildren, inject } from '@angular/core';
import { Observable, fromEvent, map, merge, startWith } from 'rxjs';
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
        <li><a href="#" #selection data-type="all">All</a></li>
        <li><a href="#" #selection data-type="statistics">Stats</a></li>
        <li><a href="#" #selection data-type="abilities">Abilities</a></li>
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

  @ViewChildren('selection', { read: ElementRef })
  selections!: QueryList<ElementRef<HTMLLinkElement>>;

  componentMap: Record<string, any> = {
    'statistics': [PokemonStatsComponent],
    'abilities': [PokemonAbilitiesComponent],
    'all': [PokemonStatsComponent, PokemonAbilitiesComponent],
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
        map(() => { 
          const selection = nativeElement.dataset['type'] || 'all';
          return this.componentMap[selection];
        }),
      ),
    );

    this.dynamicComponents$ = merge(...linkClicked$)
      .pipe(startWith(this.componentMap['all']));
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.myInjector = this.createPokemonInjector(changes['pokemon'].currentValue);
  }
}
