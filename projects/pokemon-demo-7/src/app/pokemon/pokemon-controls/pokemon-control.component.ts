import { NgFor } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, OnDestroy, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { fromEvent, map, merge, Subscription } from 'rxjs';
import { emitPokemonId } from '../custom-operators/emit-pokemon-id.operator';
import { searchInput } from '../custom-operators/search-input.operator';
import { POKEMON_ACTION } from '../enum/pokemon.enum';
import { PokemonService } from '../services/pokemon.service';

@Component({
  selector: 'app-pokemon-controls',
  standalone: true,
  imports: [FormsModule, NgFor],
  template: `
    <div class="container">
      <button *ngFor="let delta of [-2, -1, 1, 2]" class="btn" #btn [attr.data-delta]="delta">
        {{ delta < 0 ? delta : '+' + delta }}
      </button>
      <form #f="ngForm" novalidate>
        <input type="number" [(ngModel)]="searchId" [ngModelOptions]="{ updateOn: 'blur' }"
          name="searchId" id="searchId" />
      </form>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      padding: 1rem;
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
export class PokemonControlsComponent implements OnDestroy, AfterViewInit {
  @ViewChildren('btn', { read: ElementRef })
  btns!: QueryList<ElementRef<HTMLButtonElement>>;

  @ViewChild('f', { static: true, read: NgForm })
  myForm!: NgForm;

  searchId = 1;
  pokemonService = inject(PokemonService);
  subscription!: Subscription;

  ngAfterViewInit(): void {
    const btns$ = this.btns.map(({nativeElement}) => this.createButtonClickObservable(nativeElement));
    const inputId$ = this.myForm.form.valueChanges.pipe(searchInput(1, 100));

    this.subscription = merge(...btns$, inputId$)
      .pipe(emitPokemonId(1, 100))
      .subscribe((pokemonId) => this.pokemonService.updatePokemonId(pokemonId));
  }

  createButtonClickObservable(nativeElement: HTMLButtonElement) {
    const value = +(nativeElement.dataset['delta'] || 0);
    return fromEvent(nativeElement, 'click').pipe(
      map(() => ({ value, action: POKEMON_ACTION.ADD }))
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
