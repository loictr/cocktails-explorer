import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cocktail, CocktailDetails } from '../models/cocktail.model';

@Injectable({
  providedIn: 'root'
})
export class CocktailService {
  private apiUrl = '/api';  // Update this to match the combined service
  private selectedCocktails: Set<string> = new Set();

  constructor(private http: HttpClient) {}

  getCocktails(): Observable<Cocktail[]> {
    return this.http.get<Cocktail[]>(`${this.apiUrl}/cocktails`);
  }

  getCocktail(id: string): Observable<CocktailDetails> {
    return this.http.get<CocktailDetails>(`${this.apiUrl}/cocktails/${id}`);
  }

  getSuggestedCocktails(): Observable<Cocktail[]> {
    var body = {
      liked_ids: Array.from(this.selectedCocktails)
    };

    return this.http.post<Cocktail[]>(`${this.apiUrl}/cocktails/suggestions`, body);
  }

  toggleSelection(cocktailId: string): void {
    if (this.selectedCocktails.has(cocktailId)) {
      this.selectedCocktails.delete(cocktailId);
    } else {
      this.selectedCocktails.add(cocktailId);
    }
  }

  isSelected(cocktailId: string): boolean {
    return this.selectedCocktails.has(cocktailId);
  }
}