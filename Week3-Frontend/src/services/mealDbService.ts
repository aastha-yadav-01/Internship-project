import type { MealDbRawRecipe, MealDbSearchResponse, Recipe } from "../types/recipe";

const API_URL = import.meta.env.VITE_MEALDB_API_URL as string;
const API_KEY = import.meta.env.VITE_MEALDB_API_KEY as string;

function baseUrl(): string {
  return `${API_URL}/${API_KEY}`;
}

// Converts TheMealDB's flat strIngredient1..20 / strMeasure1..20 fields
// into a clean array, skipping empty slots.
function normalizeIngredients(raw: MealDbRawRecipe): { name: string; measure: string }[] {
  const ingredients: { name: string; measure: string }[] = [];
  for (let i = 1; i <= 20; i++) {
    const name = raw[`strIngredient${i}`];
    const measure = raw[`strMeasure${i}`];
    if (name && name.trim().length > 0) {
      ingredients.push({ name: name.trim(), measure: (measure ?? "").trim() });
    }
  }
  return ingredients;
}

export function normalizeRecipe(raw: MealDbRawRecipe): Recipe {
  return {
    id: raw.idMeal,
    title: raw.strMeal,
    category: raw.strCategory ?? "Uncategorized",
    area: raw.strArea ?? "Unknown",
    thumbnail: raw.strMealThumb ?? "",
    instructions: raw.strInstructions ?? "",
    tags: raw.strTags ? raw.strTags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    youtubeUrl: raw.strYoutube || null,
    ingredients: normalizeIngredients(raw),
  };
}

async function handleResponse(res: Response): Promise<MealDbSearchResponse> {
  if (!res.ok) {
    throw new Error(`TheMealDB request failed with status ${res.status}`);
  }
  return (await res.json()) as MealDbSearchResponse;
}

/**
 * Search recipes by name.
 */
export async function searchRecipes(query: string): Promise<Recipe[]> {
  const res = await fetch(`${baseUrl()}/search.php?s=${encodeURIComponent(query)}`);
  const data = await handleResponse(res);
  if (!data.meals) return [];
  return data.meals.map(normalizeRecipe);
}

/**
 * Fetch every recipe whose name starts with a given letter.
 * Used to build a varied "discover" list since TheMealDB has no
 * "browse everything" endpoint.
 */
export async function searchRecipesByFirstLetter(letter: string): Promise<Recipe[]> {
  const res = await fetch(`${baseUrl()}/search.php?f=${letter}`);
  const data = await handleResponse(res);
  if (!data.meals) return [];
  return data.meals.map(normalizeRecipe);
}

/**
 * Fetch a single recipe by id — used when a favorite needs full detail
 * that wasn't already available.
 */
export async function getRecipeById(id: string): Promise<Recipe | null> {
  const res = await fetch(`${baseUrl()}/lookup.php?i=${encodeURIComponent(id)}`);
  const data = await handleResponse(res);
  if (!data.meals || data.meals.length === 0) return null;
  return normalizeRecipe(data.meals[0]);
}
