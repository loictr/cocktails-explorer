import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Cocktail } from '../../models/cocktail.model';
import { AlcoholBadgeComponent } from '../badges/alcohol-badge';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cocktail-card',
  imports: [CommonModule, RouterModule, AlcoholBadgeComponent, MatIconModule, MatButtonModule],
  standalone: true,
  template: `
    <div class="card slide-up" (click)="navigateToDetails()">
      <div class="image-container">
        <img [src]="cocktail.image_thumb" [alt]="cocktail.name">
        <div class="overlay">
          <app-alcohol-badge [cocktail]="cocktail"></app-alcohol-badge>
        </div>
      </div>
      <div class="card-content">
        <h3>{{ cocktail.name }}</h3>
        <div class="ingredients">
          <h4>Ingredients:</h4>
          <ul>
            <li *ngFor="let ingredient of cocktail.ingredients">
              {{ ingredient }}
            </li>
          </ul>
        </div>
      </div>
      <div class="card-footer">
        <a [routerLink]="['/cocktail', cocktail.id]" 
           class="btn view-details"
           (click)="$event.stopPropagation()">
           View Details
        </a>
        <button mat-icon-button class="btn-favorite" (click)="toggleFavorite($event)" [class.selected]="isSelected">
          <mat-icon>favorite_border</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .card {
      cursor: pointer;
    }
    .image-container {
      position: relative;
      overflow: hidden;
    }
    .overlay {
      position: absolute;
      top: 1rem;
      right: 1rem;
      transition: all var(--transition-speed);
    }
    .badge {
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 2rem;
      font-size: 0.9rem;
    }
    h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: var(--text-color);
    }
    h4 {
      font-size: 1rem;
      color: #666;
      margin: 0 0 0.5rem 0;
    }
    .ingredients ul {
      list-style: none;
      padding: 0;
      margin: 0 0 0 0;
    }
    .ingredients li {
      padding-top: 0.25rem 0;
      color: #555;
      font-size: 0.95rem;
    }
    .ingredients li:before {
      content: "•";
      color: var(--primary-color);
      font-weight: bold;
      margin-right: 0.5rem;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .view-details {
      text-align: center;
    }

    .btn-favorite {
      color: var(--primary-color);
      vertical-align: middle;
    }

    .btn-favorite mat-icon {
      font-size: 3rem;
      height: 3rem;
      width: 3rem;

      top: -0.75rem;
      left: -0.75rem;
    }

    .btn-favorite:hover mat-icon::before {
      content: 'favorite';
      color: var(--primary-dark);
    }

    .btn-favorite mat-icon::before {
      content: 'favorite_border';
    }

    .btn-favorite.selected mat-icon::before {
      content: 'favorite';
    }

    .card-content {
      padding: 2.5rem;
    }

    .ingredients li {
      padding: 0.75rem 0;
      border-bottom: 1px solid rgba(217, 96, 24, 0.1);
      color: #666;
      font-size: 1rem;
      transition: all var(--transition-speed);
    }

    .ingredients li:hover {
      color: var(--primary-color);
      transform: translateX(8px);
    }

    .btn-favorite mat-icon {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .btn-favorite.selected mat-icon {
      color: var(--primary-color);
      transform: scale(1.2);
    }

    .card:hover {
      transform: translateY(-12px) rotate(1deg);
      box-shadow: 0 25px 50px rgba(217, 96, 24, 0.12);
    }

    .card img {
      height: 250px;
      filter: brightness(1.05);
      transition: all var(--transition-speed) cubic-bezier(0.4, 0, 0.2, 1);
    }

    .card:hover img {
      transform: scale(1.08);
    }
  `]
})
export class CocktailCardComponent {
  @Input() cocktail!: Cocktail;
  @Input() isSelected = false;
  @Output() onSelect = new EventEmitter<string>();

  constructor(private router: Router) {}

  navigateToDetails() {
    this.router.navigate(['/cocktail', this.cocktail.id]);
  }

  toggleFavorite(event: Event) {
    event.stopPropagation();
    this.onSelect.emit(this.cocktail.id);
  }
}
