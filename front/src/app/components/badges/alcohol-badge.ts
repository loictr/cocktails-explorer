import { Component, Input } from '@angular/core';
import { CocktailBase } from '../../models/cocktail.model';

@Component({
  selector: 'app-alcohol-badge',
  standalone: true,
  template: `
    <span class="badge">{{content}}</span>
  `,
  styles: [`
    .badge {
      background: rgba(0, 0, 0, 0.4);
      color: white;
      padding: 0.75rem 1.25rem;
      border-radius: 2rem;
      font-size: 1rem;
      backdrop-filter: blur(4px);
    }
  `]
})
export class AlcoholBadgeComponent {
  @Input() cocktail!: CocktailBase;

  get content(){
    switch(this.cocktail.alcohol){
        case 'Alcoholic': return '🥴 Alcoholic';
        case 'Non-Alcoholic': 
        case 'Non alcoholic': //TODO normalize alcohol info this in the db
            return '😌 Non-Alcoholic'
        case 'Optional alcohol': return '🤔 Optional alcohol'
        default: return '🤔 Alcohol ???';
    }
  }
}