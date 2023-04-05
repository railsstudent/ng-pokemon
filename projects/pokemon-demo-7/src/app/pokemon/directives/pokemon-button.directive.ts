import { Directive, ElementRef, Input, OnInit, inject } from '@angular/core';
import { Observable, fromEvent, map } from 'rxjs';
import { POKEMON_ACTION } from '../enum/pokemon.enum';

@Directive({
  selector: '[appPokemonButton]',
  standalone: true
})
export class PokemonButtonDirective implements OnInit {
  @Input()
  appPokemonButton = 0;

  private nativeElement = inject(ElementRef<HTMLButtonElement>).nativeElement;
  click$!: Observable<{ value: number, action: POKEMON_ACTION }>;

  ngOnInit(): void {
    this.click$ = fromEvent(this.nativeElement, 'click').pipe(
      map(() => ({ value: this.appPokemonButton, action: POKEMON_ACTION.ADD })),
    );
  }
}
