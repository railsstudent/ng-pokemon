import { Route } from '@angular/router';

export const APP_ROUTES: Route[] = [
    {
      path: 'pokemon',
      loadComponent: () => import('./pokemon/pokemon/pokemon.component').then(c => c.PokemonComponent)
    }
];
