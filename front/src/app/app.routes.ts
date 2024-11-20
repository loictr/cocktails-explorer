import { Routes } from '@angular/router';
import { CocktailListComponent } from './pages/cocktail-list/cocktail-list.component';

// TODO: when the user navigates to /cocktails/suggestions then to a cocktails details, the back button should take them back to /cocktails/suggestions

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'cocktails',
    pathMatch: 'full'
  },
  {
    path: 'cocktails',
    loadComponent: () => 
      import('./pages/cocktail-list/cocktail-list.component').then(m => m.CocktailListComponent),
    children: [
      {
        path: '',
        component: CocktailListComponent
      },
      {
        path: 'suggestions',
        component: CocktailListComponent
      }
    ]
  },
  {
    path: 'cocktail/:id',
    loadComponent: () => 
      import('./pages/cocktail-detail/cocktail-detail.component').then(m => m.CocktailDetailComponent)
  }
];