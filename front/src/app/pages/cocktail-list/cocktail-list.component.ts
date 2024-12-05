import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CocktailService } from '../../services/cocktail.service';
import { Cocktail } from '../../models/cocktail.model';
import { CocktailCardComponent } from '../../components/cocktail-card/cocktail-card.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-cocktail-list',
  standalone: true,
  imports: [CommonModule, RouterModule, CocktailCardComponent, LoaderComponent],
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
      <div>Pick your top cocktails, then let us mix up some new recommendations just for you.</div>
    </div>
    <div class="page-header fade-in" *ngIf="showingSuggestions">
      <div class="page-header-first-row">
        <h1>Suggested Cocktails</h1>
        <button class="btn" 
                (click)="hideSuggestions()" 
                [disabled]="!hasSelections">
                ← Back to Selection
        </button>
      </div>
      <div>Tailored cocktail picks inspired by your favorites</div>
    </div>

    <app-loader *ngIf="isLoading"></app-loader>

    <div *ngIf="!showingSuggestions && !isLoading">
      <div class="letter-index">
        <button 
          *ngFor="let letter of alphabet" 
          class="letter-btn"
          [class.active]="selectedLetter === letter"
          (click)="filterByLetter(letter)">
          {{letter}}
        </button>
        <button 
          class="letter-btn all"
          [class.active]="!selectedLetter"
          (click)="filterByLetter(null)">
          All
        </button>
      </div>

      <div class="grid">
        <app-cocktail-card
          *ngFor="let cocktail of filteredCocktails"
          [cocktail]="cocktail"
          [isSelected]="isSelected(cocktail.id)"
          (onSelect)="toggleSelection($event)">
        </app-cocktail-card>
      </div>
    </div>

    <div *ngIf="showingSuggestions && !isLoading" class="suggestions slide-up">
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
    .page-header {
      position: sticky;
      top: 0;
      z-index: 1000;
      padding: 1rem 1rem;
      border-radius: 1rem;
      background-color: var(--background-color);
      color: var(--text-color);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
      top: 1rem;
    }
    .page-header-first-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
    }
    h1 {
      font-size: 1.5rem;
      font-weight: 500;
      color: #0885CF;
      flex: 1 1 100%;
    }
    .btn {
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
      flex: 1 1 100%;
    }
    @media (min-width: 600px) {
      .page-header-first-row {
        flex-wrap: nowrap;
      }
      h1 {
        font-size: 2.5rem;
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
    .letter-index {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 2rem;
      justify-content: center;
      padding: 0.5rem;
      background: white;
      border-radius: var(--border-radius);
      box-shadow: var(--card-shadow);
    }

    .letter-btn {
      background: none;
      border: none;
      padding: 0.5rem 0.75rem;
      border-radius: 0.5rem;
      cursor: pointer;
      font-family: inherit;
      font-size: 1rem;
      color: var(--text-color);
      transition: all var(--transition-speed);
    }

    .letter-btn:hover {
      background: rgba(var(--primary-color-rgb), 0.1);
    }

    .letter-btn.active {
      background: var(--primary-color);
      color: white;
    }

    .letter-btn.all {
      font-weight: 600;
      margin-left: 1rem;
    }
  `]
})
export class CocktailListComponent implements OnInit {
  cocktails: Cocktail[] = [];
  suggestedCocktails: Cocktail[] = [];
  showingSuggestions = false;
  isLoading = true;
  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  selectedLetter: string | null = null;
  filteredCocktails: Cocktail[] = [];

  constructor(
    private cocktailService: CocktailService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.cocktailService.getCocktails().subscribe(
      cocktails => {
        this.cocktails = cocktails;
        this.filteredCocktails = cocktails;
        this.isLoading = false;
      }
    );

    this.route.url.subscribe(url => {
      if (url.some(segment => segment.path === 'suggestions')) {
        this.showSuggestions();
      } else {
        this.hideSuggestions();
      }
    });
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

  async showSuggestions(): Promise<void> {
    if (this.hasSelections) {
      this.isLoading = true;
      this.showingSuggestions = true;
      
      this.cocktailService.getSuggestedCocktails().subscribe(
        suggestions => {
          this.suggestedCocktails = suggestions;
          this.isLoading = false;
          window.scrollTo(0, 0);
        }
      );
      
      this.location.replaceState('/suggestions');
    }
  }

  hideSuggestions(): void {
    this.showingSuggestions = false;
    this.router.navigate(['/cocktails']); // Navigate to cocktails list route
    window.scrollTo(0, 0);
  }

  filterByLetter(letter: string | null): void {
    this.selectedLetter = letter;
    if (!letter) {
      this.filteredCocktails = this.cocktails;
    } else {
      this.filteredCocktails = this.cocktails.filter(
        cocktail => cocktail.name.toUpperCase().startsWith(letter)
      );
    }
  }
}