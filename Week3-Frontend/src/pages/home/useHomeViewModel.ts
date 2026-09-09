import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getRecipes, getInitialRecipes } from "./home.model";
import {
  addFavoriteRecipe,
  removeFavoriteRecipe,
  getFavoriteRecipes,
} from "../../services/firebaseService";
import { useAuth } from "../../context/AuthContext";
import type { Recipe } from "../../types/recipe";

export function useHomeViewModel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("search") ?? "");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadInitialRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);
    setQuery("");
    try {
      const result = await getInitialRecipes();
      setRecipes(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load recipes.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getRecipes(query);
      setRecipes(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search recipes.");
    } finally {
      setLoading(false);
    }
  }, [query]);

  // On first mount: if we arrived with a ?search= param (e.g. from the
  // Favorites page's search box), run that search. Otherwise load a fresh,
  // varied set of recipes.
  useEffect(() => {
    const initialQuery = searchParams.get("search");
    if (initialQuery && initialQuery.trim().length >= 2) {
      handleSearch();
      setSearchParams({}, { replace: true });
    } else {
      loadInitialRecipes();
    }
    // Intentionally run only once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep track of which recipes are already favorited so hearts render filled.
  useEffect(() => {
    if (!user) {
      setFavoriteIds(new Set());
      return;
    }
    getFavoriteRecipes(user.uid)
      .then((favorites) => setFavoriteIds(new Set(favorites.map((f) => f.id))))
      .catch(() => {
        // Non-fatal: favorite state just won't be pre-highlighted.
      });
  }, [user]);

  const handleToggleFavorite = useCallback(
    async (recipe: Recipe) => {
      if (!user) {
        navigate("/auth");
        return;
      }
      const isFavorite = favoriteIds.has(recipe.id);
      try {
        if (isFavorite) {
          await removeFavoriteRecipe(user.uid, recipe.id);
          setFavoriteIds((prev) => {
            const next = new Set(prev);
            next.delete(recipe.id);
            return next;
          });
        } else {
          await addFavoriteRecipe(user.uid, recipe);
          setFavoriteIds((prev) => new Set(prev).add(recipe.id));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not update favorites.");
      }
    },
    [user, favoriteIds, navigate]
  );

  return {
    query,
    setQuery,
    recipes,
    favoriteIds,
    loading,
    error,
    handleSearch,
    loadInitialRecipes,
    handleToggleFavorite,
  };
}
