import { Route } from '@angular/router';

export const APP_ROUTES: Route[] = [
    {
      path: 'pokemon',
      loadComponent: () => import('./pokemon/pokemon/pokemon.component').then(c => c.PokemonComponent)
    },
    {
      path: '',
      pathMatch: 'full',
      loadComponent: () => import('./home/home.component').then(c => c.HomeComponent)
    },
    {
      path: '**',
      loadComponent: () => import('./page-not-found/page-not-found.component').then(c => c.PageNotFoundComponent)
    }
];
