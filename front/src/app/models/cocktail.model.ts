export abstract class CocktailBase {
  id!: string;
  name!: string;
  image_thumb: string | undefined;
  alcohol: string | undefined;
  glass: string | undefined;
}


export class Cocktail extends CocktailBase {
  ingredients: string[] = [];
}

export class CocktailDetails extends CocktailBase {
  measures: {
    ingredient: string;
    measure: string;
  }[] = [];
  instructions: string | undefined;
}



