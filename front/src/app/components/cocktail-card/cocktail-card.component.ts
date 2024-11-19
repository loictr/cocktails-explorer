import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Cocktail } from '../../models/cocktail.model';
import { AlcoholBadgeComponent } from '../badges/alcohol-badge';

@Component({
  selector: 'app-cocktail-card',
  standalone: true,
  imports: [CommonModule, RouterModule, AlcoholBadgeComponent],
  template: `
    <div class="card slide-up" 
         [class.selected]="isSelected"
         (click)="onSelect.emit(cocktail.id)">
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
        <a [routerLink]="['/cocktail', cocktail.id]" 
           class="btn view-details"
           (click)="$event.stopPropagation()">
           View Details
        </a>
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
      margin: 0 0 1.5rem 0;
    }
    .ingredients li {
      padding: 0.25rem 0;
      color: #555;
      font-size: 0.95rem;
    }
    .ingredients li:before {
      content: "•";
      color: var(--primary-color);
      font-weight: bold;
      margin-right: 0.5rem;
    }
    .view-details {
      text-align: center;
    }
  `]
})
export class CocktailCardComponent {
  @Input() cocktail!: Cocktail;
  @Input() isSelected = false;
  @Output() onSelect = new EventEmitter<string>();
}