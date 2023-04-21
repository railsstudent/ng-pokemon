import { Directive, ElementRef, Input, OnInit, inject } from '@angular/core';
import { Observable, fromEvent, map } from 'rxjs';
import { POKEMON_TAB } from '../enum/pokemon-tab.enum';
import { DynamicComponents } from '../types/pokemon-tab.type';

@Directive({
  selector: '[appPokemonLink]',
  standalone: true
})
export class PokemonLinkDirective implements OnInit {

  @Input()
  appPokemonLink = '';

  @Input()
  appPokemonLinkComponentMap!: Record<POKEMON_TAB, DynamicComponents>;

  nativeElement = inject(ElementRef<HTMLLinkElement>).nativeElement;
  click$!: Observable<DynamicComponents>;

  ngOnInit(): void {
    this.click$ = fromEvent(this.nativeElement, 'click')
      .pipe(
        map(() => POKEMON_TAB[this.appPokemonLink as keyof typeof POKEMON_TAB]),
        map((value) => this.appPokemonLinkComponentMap[value])
      );
  }
}
