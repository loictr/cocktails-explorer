import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CocktailService } from '../../services/cocktail.service';
import { Cocktail } from '../../models/cocktail.model';
import { CocktailCardComponent } from '../../components/cocktail-card/cocktail-card.component';

@Component({
  selector: 'app-cocktail-list',
  standalone: true,
  imports: [CommonModule, RouterModule, CocktailCardComponent],
  template: `
    <div class="page-header fade-in" *ngIf="!showingSuggestions">
      <div class="page-header-first-row">
        <h1>Discover Cocktails</h1>
        <button class="btn" 
                (click)="showSuggestions()" 
                [disabled]="!hasSelections">
          ✨ Show Suggestions
        </button>
      </div>
      <div>Select your favorite cocktails</div>
    </div>
    <div class="page-header fade-in" *ngIf="showingSuggestions">
      <div class="page-header-first-row">
        <h1>Suggested Cocktails</h1>
        <button class="btn" 
                (click)="showingSuggestions = false" 
                [disabled]="!hasSelections">
                ← Back to Selection
        </button>
      </div>
      <div>Our suggestions based on your favorite cocktails</div>
    </div>

    <div *ngIf="!showingSuggestions" class="grid">
      <app-cocktail-card
        *ngFor="let cocktail of cocktails"
        [cocktail]="cocktail"
        [isSelected]="isSelected(cocktail.id)"
        (onSelect)="toggleSelection($event)">
      </app-cocktail-card>
    </div>

    <div *ngIf="showingSuggestions" class="suggestions slide-up">
      <div class="grid">
        <app-cocktail-card
          *ngFor="let cocktail of suggestedCocktails"
          [cocktail]="cocktail"
          [isSelected]="isSelected(cocktail.id)"
          (onSelect)="toggleSelection($event)">
        </app-cocktail-card>
      </div>
    </div>
  `,
  styles: [`
    .page-header-first-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    h1 {
      font-size: 2.5rem;
      color: var(--text-color);
      flex: 1 1 100%;
    }
    .btn {
      margin-top: 1rem;
      flex: 1 1 100%;
    }
    @media (min-width: 600px) {
      .page-header-first-row {
        flex-wrap: nowrap;
      }
      h1 {
        flex: 0 1 auto;
      }
      .btn {
        margin-top: 0;
        flex: 0 1 auto;
      }
    }
    .suggestions-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    h2 {
      font-size: 2rem;
      color: var(--text-color);
    }
    .btn-secondary {
      background-color: var(--secondary-color);
    }
    .btn-secondary:hover {
      background-color: #45b8b0;
    }
  `]
})
export class CocktailListComponent implements OnInit {
  cocktails: Cocktail[] = [];
  suggestedCocktails: Cocktail[] = [];
  showingSuggestions = false;

  constructor(private cocktailService: CocktailService) {}

  ngOnInit(): void {
    this.cocktailService.getCocktails().subscribe(
      cocktails => this.cocktails = cocktails
    );
  }

  toggleSelection(id: string): void {
    this.cocktailService.toggleSelection(id);
  }

  isSelected(id: string): boolean {
    return this.cocktailService.isSelected(id);
  }

  get hasSelections(): boolean {
    return this.cocktails.some(c => this.isSelected(c.id));
  }

  showSuggestions(): void {
    this.cocktailService.getSuggestedCocktails().subscribe(
      suggestions => {
        this.suggestedCocktails = suggestions;
        this.showingSuggestions = true;
      }
    );
  }
}