import {
  getFavoriteRecipes,
  removeFavoriteRecipe,
} from "../../services/firebaseService";
import type { Recipe } from "../../types/recipe";

// Thin wrapper around the Firebase service so the view model never talks
// to Firebase directly — keeps the data-access boundary in one place.
export async function loadFavorites(userId: string): Promise<Recipe[]> {
  return getFavoriteRecipes(userId);
}

export async function deleteFavorite(userId: string, recipeId: string): Promise<void> {
  return removeFavoriteRecipe(userId, recipeId);
}
