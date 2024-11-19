import { Component, Input } from '@angular/core';
import { CocktailBase } from '../../models/cocktail.model';

@Component({
  selector: 'app-glass-badge',
  standalone: true,
  template: `
    <span class="badge glass">{{picture}} {{ cocktail.glass }}</span>
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
export class GlassBadgeComponent {
  @Input() cocktail!: CocktailBase;

  get picture() {

    const values: { [key: string]: string } = {
        'Balloon Glass': '🍷',
        'Beer Glass': '🍺',
        'Beer mug': '🍺',
        'Beer pilsner': '🍺',
        'Brandy snifter': '🥃',
        'Champagne Flute': '🥂',
        'Champagne flute': '🥂', //TODO normalize glass info this in the db
        'Cocktail Glass': '🍸',
        'Cocktail glass': '🍸',
        'Coffee Mug': '☕',
        'Coffee mug': '☕',
        'Collins Glass': '🥛',
        'Collins glass': '🥛',
        'Copper Mug': '🍺',
        'Cordial glass': '🥃',
        'Coupe Glass': '🍸',
        'Highball Glass': '🥛',
        'Highball glass': '🥛',
        'Hurricane glass': '🍹',
        'Irish coffee cup': '☕',
        'Jar': '🍺',
        'Margarita glass': '🍹',
        'Margarita/Coupette glass': '🍸',
        'Martini Glass': '🍸',
        'Mason jar': '🍺',
        'Nick and Nora Glass': '🍸',
        'Old-Fashioned glass': '🥛',
        'Old-fashioned glass': '🥛',
        'Pint glass': '🍺',
        'Pitcher': '🍺',
        'Pousse cafe glass': '🍸',
        'Punch Bowl': '🍹',
        'Punch bowl': '🍹',
        'Shot Glass': '🥛',
        'Shot glass': '🥛',
        'Whiskey Glass': '🥛',
        'Whiskey sour glass': '🥛',
        'White wine glass': '🍷',
        'Wine Glass': '🍷',
    };

    const keys = Object.keys(values);

    if (!this.cocktail.glass || !keys.includes(this.cocktail.glass)) {
        return '🥛';
    }

    return values[this.cocktail.glass as string];
  }
}