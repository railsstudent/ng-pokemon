import { NgComponentOutlet } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Injector, Input, QueryList, ViewChildren, inject } from '@angular/core';
import { fromEvent, map, merge } from 'rxjs';
import { POKEMON_OBJ } from '../constants/pokemon.constant';
import { FlattenPokemon } from '../interfaces/pokemon.interface';
import { PokemonAbilitiesComponent } from '../pokemon-abilities/pokemon-abilities.component';
import { PokemonStatsComponent } from '../pokemon-stats/pokemon-stats.component';

@Component({
  selector: 'app-pokemon-tab',
  standalone: true,
  imports: [PokemonAbilitiesComponent, PokemonStatsComponent, NgComponentOutlet],
  template: `
    <div style="padding: 0.5rem;">
      <ul>
        <li><a href="#" #selection data-type="all">All</a></li>
        <li><a href="#"  #selection data-type="statistics">Stats</a></li>
        <li><a href="#" #selection data-type="abilities">Abilities</a></li>
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
export class PokemonTabComponent implements AfterViewInit {
  @Input()
  pokemon!: FlattenPokemon;

  @ViewChildren('selection', { read: ElementRef })
  selections!: QueryList<ElementRef<HTMLLinkElement>>;

  PokemonAbilitiesComponent = PokemonAbilitiesComponent;
  PokemonStatsComponent = PokemonStatsComponent;

  injector = inject(Injector);
  myInjector = Injector.create({
    providers: [{
      provide: POKEMON_OBJ,
      useValue: this.pokemon,
    }],
    parent: this.injector
  });

  ngAfterViewInit(): void {
    const linkClicked$ = this.selections.map(({ nativeElement }) => {
      const type = nativeElement.dataset['type'];
      return fromEvent(nativeElement, 'click').pipe(map(() => type))
    });

    merge(...linkClicked$)
      .pipe(
        map((selection) => {
          const myInjector = Injector.create({
            providers: [{
              provide: POKEMON_OBJ,
              useValue: this.pokemon,
            }],
            parent: this.injector
          });          
        })
      )
      .subscribe((value) => console.log(value));
  }
}
