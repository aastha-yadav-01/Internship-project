// Shape returned by TheMealDB for a single meal.
// TheMealDB returns ingredient/measure pairs as up to 20 numbered flat fields
// (strIngredient1..20, strMeasure1..20), which is awkward to consume directly,
// so we also define a normalized shape below.
export interface MealDbRawRecipe {
  idMeal: string;
  strMeal: string;
  strCategory: string | null;
  strArea: string | null;
  strInstructions: string | null;
  strMealThumb: string | null;
  strTags: string | null;
  strYoutube: string | null;
  [key: `strIngredient${number}`]: string | null | undefined;
  [key: `strMeasure${number}`]: string | null | undefined;
}

export interface MealDbSearchResponse {
  meals: MealDbRawRecipe[] | null;
}

export interface Ingredient {
  name: string;
  measure: string;
}

// Normalized recipe shape used throughout the app UI.
export interface Recipe {
  id: string;
  title: string;
  category: string;
  area: string;
  thumbnail: string;
  instructions: string;
  tags: string[];
  youtubeUrl: string | null;
  ingredients: Ingredient[];
}
