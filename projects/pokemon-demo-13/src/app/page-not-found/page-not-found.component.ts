import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { map, shareReplay, tap, takeWhile, timer } from 'rxjs';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <div>
      <h2>Page not found</h2>
      <p>Return home after {{ countDown$ | async }} seconds</p>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    div {
      display: flex;
      align-items: center;
      flex-direction: column;
    }
  `]
})
export class PageNotFoundComponent {
  router = inject(Router);

  countDown$ = timer(0, 1000)
    .pipe(
      map((value) => 10 - value),
      takeWhile((value) => value >= 0),
      shareReplay(1),
    );
  
  redirectHome$ = this.countDown$.pipe(
    tap((value) => {
      if (value <= 0) {
        this.router.navigate(['']);
      }
    }),
    takeUntilDestroyed()
  );

  constructor() {
    this.redirectHome$.subscribe();
  }
}
