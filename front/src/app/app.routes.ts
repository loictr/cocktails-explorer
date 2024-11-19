import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./pages/cocktail-list/cocktail-list.component').then(m => m.CocktailListComponent)
  },
  {
    path: 'cocktail/:id',
    loadComponent: () => 
      import('./pages/cocktail-detail/cocktail-detail.component').then(m => m.CocktailDetailComponent)
  }
];