import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CocktailService } from '../../services/cocktail.service';
import { CocktailDetails } from '../../models/cocktail.model';
import { AlcoholBadgeComponent } from '../../components/badges/alcohol-badge';
import { GlassBadgeComponent } from '../../components/badges/glass-badge';

@Component({
  selector: 'app-cocktail-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, AlcoholBadgeComponent, GlassBadgeComponent],
  template: `
    <div *ngIf="cocktail" class="cocktail-detail slide-up">
      <a routerLink="/" class="btn btn-secondary back-btn">← Back to List</a>
      
      <div class="detail-content">
        <div class="image-section">
          <img [src]="cocktail.image_thumb" [alt]="cocktail.name">
          <div class="floating-badges">
            <app-alcohol-badge [cocktail]="cocktail"></app-alcohol-badge>
            <app-glass-badge [cocktail]="cocktail"></app-glass-badge>
          </div>
        </div>
        
        <div class="info">
          <h1>{{ cocktail.name }}</h1>

          <section class="ingredients-section">
            <h2>Ingredients</h2>
            <ul class="ingredients">
              <li *ngFor="let item of cocktail.measures | keyvalue">
                <span class="ingredient">{{ item.key }}</span>
                <span class="measure">{{ item.value }}</span>
              </li>
            </ul>
          </section>

          <section class="instructions-section">
            <h2>Instructions</h2>
            <div class="instructions">
              {{ cocktail.instructions }}
            </div>
          </section>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cocktail-detail {
      max-width: 1000px;
      margin: 0 auto;
    }
    .back-btn {
      margin-bottom: 2rem;
      display: inline-block;
    }
    .detail-content {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: var(--card-shadow);
    }
    .image-section {
      position: relative;
    }
    img {
      width: 100%;
      height: 400px;
      object-fit: cover;
    }
    .floating-badges {
      position: absolute;
      bottom: 1.5rem;
      left: 1.5rem;
      display: flex;
      gap: 0.75rem;
    }
    .info {
      padding: 2.5rem;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 2rem;
      color: var(--text-color);
    }
    h2 {
      font-size: 1.5rem;
      color: var(--text-color);
      margin-bottom: 1rem;
    }
    section {
      margin: 2rem 0;
    }
    .ingredients {
      list-style: none;
      padding: 0;
    }
    .ingredients li {
      display: flex;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #eee;
    }
    .measure {
      color: var(--primary-color);
      font-weight: 600;
      min-width: 100px;
    }
    .ingredient {
      color: var(--text-color);
      padding-right: 1rem;
    }
    .instructions {
      line-height: 1.8;
      color: #444;
    }
    .btn-secondary {
      background-color: var(--secondary-color);
    }
    .btn-secondary:hover {
      background-color: #45b8b0;
    }
    @media (min-width: 768px) {
      .detail-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
      }
      .image-section {
        height: 100%;
      }
      img {
        height: 100%;
      }
      .floating-badges {
        top: 1.5rem;
        bottom: auto;
      }
    }
  `]
})
export class CocktailDetailComponent implements OnInit {
  cocktail?: CocktailDetails;

  constructor(
    private route: ActivatedRoute,
    private cocktailService: CocktailService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cocktailService.getCocktail(id).subscribe(
        cocktail => this.cocktail = cocktail
      );
    }
  }
}