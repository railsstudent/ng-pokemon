import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, merge, scan, startWith, shareReplay, map, fromEvent } from 'rxjs';

@Component({
  selector: 'app-pokemon',
  standalone: true,
  imports: [AsyncPipe],
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
    </div>`,
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

  btnPokemonId$!: Observable<number>;
  btnFrontImageUrl$!: Observable<string>;
  btnBackImageUrl$!: Observable<string>;

  ngOnInit() {
    const btnMinusTwo$ = this.createButtonClickObservable(this.btnMinusTwo, -2);
    const btnMinusOne$ = this.createButtonClickObservable(this.btnMinusOne, -1);
    const btnAddOne$ = this.createButtonClickObservable(this.btnAddOne, 1);
    const btnAddTwo$ = this.createButtonClickObservable(this.btnAddTwo, 2);

    this.btnPokemonId$ = merge(btnMinusTwo$, btnMinusOne$, btnAddOne$, btnAddTwo$)
      .pipe(
        scan((acc, value) => {
          const potentialValue = acc + value;
          if (potentialValue >= 1 && potentialValue <= 100) {
            return potentialValue;
          } else if (potentialValue < 1) {
            return 1;
          }

          return 100;
        }, 1),
        startWith(1),
        shareReplay(1),
      );

      this.btnFrontImageUrl$ = this.btnPokemonId$.pipe(
        map((pokemonId: number) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemonId}.png`)
        );

      this.btnBackImageUrl$ = this.btnPokemonId$.pipe(
        map((pokemonId: number) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/${pokemonId}.png`)
        );
  }

  createButtonClickObservable(ref: ElementRef<HTMLButtonElement>, value: number) {
    return fromEvent(ref.nativeElement, 'click').pipe(map(() => value));
  }
}
