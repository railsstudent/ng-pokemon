import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, filter, map, merge, scan, startWith, shareReplay, fromEvent } from 'rxjs';
import { POKEMON_ACTION } from '../enum/pokemon.enum';

@Component({
  selector: 'app-pokemon',
  standalone: true,
  imports: [AsyncPipe, FormsModule],
  template: `
    <h1>
      Display the first 100 pokemon images
    </h1>
    <div>
      <label>Pokemon Id:
        <span>{{ btnPokemonId$ | async }}</span>
      </label>
      <div class="container">
        <img [src]="btnFrontImageUrl$ | async" />
        <img [src]="btnBackImageUrl$ | async" />
      </div>
    </div>
    <div class="container">
      <button class="btn" #btnMinusTwo>-2</button>
      <button class="btn" #btnMinusOne>-1</button>
      <button class="btn" #btnAddOne>+1</button>
      <button class="btn" #btnAddTwo>+2</button>
      <form #f="ngForm" novalidate>
        <input type="number" [(ngModel)]="searchId" [ngModelOptions]="{ updateOn: 'blur' }"
          name="searchId" id="searchId" />
      </form>
      <pre>
        searchId: {{ searchId }}
      </pre>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      font-size: 1.5rem;
      padding: 1rem;
    }

    h1 {
      margin-bottom: 20px;
    }

    .container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }

    .btn {
      border-radius: 25%;
      padding: 0.5rem 1rem;
      margin: 0.5rem;
    }

    input[type="number"] {
      padding: 0.5rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonComponent implements OnInit {
  @ViewChild('btnMinusTwo', { static: true, read: ElementRef })
  btnMinusTwo!: ElementRef<HTMLButtonElement>;

  @ViewChild('btnMinusOne', { static: true, read: ElementRef })
  btnMinusOne!: ElementRef<HTMLButtonElement>;

  @ViewChild('btnAddOne', { static: true, read: ElementRef })
  btnAddOne!: ElementRef<HTMLButtonElement>;

  @ViewChild('btnAddTwo', { static: true, read: ElementRef })
  btnAddTwo!: ElementRef<HTMLButtonElement>;

  @ViewChild('f', { static: true, read: NgForm })
  myForm!: NgForm;

  btnPokemonId$!: Observable<number>;
  btnFrontImageUrl$!: Observable<string>;
  btnBackImageUrl$!: Observable<string>;

  searchId = 1;

  ngOnInit() {
    const btnMinusTwo$ = this.createButtonClickObservable(this.btnMinusTwo, -2);
    const btnMinusOne$ = this.createButtonClickObservable(this.btnMinusOne, -1);
    const btnAddOne$ = this.createButtonClickObservable(this.btnAddOne, 1);
    const btnAddTwo$ = this.createButtonClickObservable(this.btnAddTwo, 2);

    const inputId$ = this.myForm.form.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) => prev.searchId === curr.searchId),
        filter((form) => form.searchId >= 1 && form.searchId <= 100),
        map((form) => form.searchId),
        map((value) => ({
          value,
          action: POKEMON_ACTION.OVERWRITE,
        }))
      );

    this.btnPokemonId$ = merge(btnMinusTwo$, btnMinusOne$, btnAddOne$, btnAddTwo$, inputId$)
      .pipe(
        scan((acc, { value, action }) => {
          if (action === POKEMON_ACTION.OVERWRITE) {
            return value;
          } else if (action === POKEMON_ACTION.ADD) {
            const potentialValue = acc + value;
            if (potentialValue >= 1 && potentialValue <= 100) {
              return potentialValue;
            } else if (potentialValue < 1) {
              return 1;
            }

            return 100;
          }

          return acc;
        }, 1),
        startWith(1),
        shareReplay(1),
      );

      this.btnFrontImageUrl$ = this.btnPokemonId$.pipe(
        map((pokemonId: number) =>    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemonId}.png`)
        );

      this.btnBackImageUrl$ = this.btnPokemonId$.pipe(
        map((pokemonId: number) =>    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/${pokemonId}.png`)
        );
  }

  createButtonClickObservable(ref: ElementRef<HTMLButtonElement>, value: number) {
    return fromEvent(ref.nativeElement, 'click').pipe(
      map(() => ({ value, action: POKEMON_ACTION.ADD }))
    );
  }
}
