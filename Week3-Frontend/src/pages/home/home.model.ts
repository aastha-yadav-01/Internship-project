import { searchRecipes, searchRecipesByFirstLetter } from "../../services/mealDbService";
import type { Recipe } from "../../types/recipe";

// Random seed letters used to build a varied "discover" list on first load,
// since TheMealDB has no single "browse everything" endpoint — mirrors the
// seeded-keyword trick used for the OMDB movie version of this app.
const SEED_LETTERS = ["a", "b", "c", "p", "s", "t"];

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Validate and run a user search query.
 */
export async function getRecipes(query: string): Promise<Recipe[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    throw new Error("Search query must contain at least two characters.");
  }
  return searchRecipes(trimmed);
}

/**
 * Fetch a fresh, shuffled set of recipes for the home screen's default view,
 * pulled from a handful of random letters and deduplicated by id.
 */
export async function getInitialRecipes(): Promise<Recipe[]> {
  const letters = shuffle(SEED_LETTERS).slice(0, 3);
  const results = await Promise.all(letters.map((letter) => searchRecipesByFirstLetter(letter)));

  const merged = results.flat();
  const seen = new Set<string>();
  const deduped = merged.filter((recipe) => {
    if (seen.has(recipe.id)) return false;
    seen.add(recipe.id);
    return true;
  });

  return shuffle(deduped).slice(0, 20);
}
