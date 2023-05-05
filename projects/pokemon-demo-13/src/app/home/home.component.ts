import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
    template: `
    <div>
      <h2>Click Pokemon Link</h2>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HomeComponent {}