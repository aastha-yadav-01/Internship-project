import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  remove,
  get,
  child,
  type Database,
} from "firebase/database";
import type { Recipe } from "../types/recipe";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Only the fields Firebase actually needs to boot without throwing.
// If any are missing (e.g. .env not filled in yet), we deliberately skip
// initialization instead of letting initializeApp/getDatabase throw at
// module-load time — that kind of throw happens before React ever renders,
// which is exactly what produces a blank white page with no visible error.
const REQUIRED_KEYS = ["apiKey", "authDomain", "databaseURL", "projectId", "appId"] as const;
export const isFirebaseConfigured = REQUIRED_KEYS.every(
  (key) => typeof firebaseConfig[key] === "string" && firebaseConfig[key].length > 0
);

let app: FirebaseApp | undefined;
let authInstance: Auth | undefined;
let dbInstance: Database | undefined;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    authInstance = getAuth(app);
    dbInstance = getDatabase(app);
  } catch (err) {
    // Config looked complete but Firebase still rejected it (e.g. a typo
    // in the database URL) — log it and keep the app usable without auth.
    console.error("Firebase failed to initialize:", err);
  }
} else {
  console.warn(
    "Firebase is not configured (missing VITE_FIREBASE_* env vars). " +
      "Recipe search still works; sign-in and favorites are disabled until " +
      "you fill in .env — see README.md."
  );
}

export const auth = authInstance;
export const db = dbInstance;

function favoritePath(userId: string, recipeId: string): string {
  return `favorites/${userId}/${recipeId}`;
}

function requireDb(): Database {
  if (!dbInstance) {
    throw new Error("Firebase isn't configured yet — add your Firebase keys to .env.");
  }
  return dbInstance;
}

/**
 * Save a recipe under the signed-in user's own favorites node, keyed by
 * the recipe id so re-adding the same recipe is idempotent.
 */
export async function addFavoriteRecipe(userId: string, recipe: Recipe): Promise<void> {
  try {
    await set(ref(requireDb(), favoritePath(userId, recipe.id)), recipe);
  } catch (err) {
    throw new Error("Could not save this recipe to your favorites. Please try again.");
  }
}

export async function removeFavoriteRecipe(userId: string, recipeId: string): Promise<void> {
  try {
    await remove(ref(requireDb(), favoritePath(userId, recipeId)));
  } catch (err) {
    throw new Error("Could not remove this recipe from your favorites. Please try again.");
  }
}

export async function getFavoriteRecipes(userId: string): Promise<Recipe[]> {
  try {
    const snapshot = await get(child(ref(requireDb()), `favorites/${userId}`));
    if (!snapshot.exists()) return [];
    const value = snapshot.val() as Record<string, Recipe>;
    return Object.values(value);
  } catch (err) {
    throw new Error("Could not load your favorites. Please try again.");
  }
}
