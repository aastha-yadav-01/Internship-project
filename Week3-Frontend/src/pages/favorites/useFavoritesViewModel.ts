import { useEffect, useState, useCallback } from "react";
import { loadFavorites, deleteFavorite } from "./favorites.model";
import { useAuth } from "../../context/AuthContext";
import type { Recipe } from "../../types/recipe";

export function useFavoritesViewModel() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const result = await loadFavorites(user.uid);
      setFavorites(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load favorites.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const removeFavorite = useCallback(
    async (recipeId: string) => {
      if (!user) return;
      try {
        await deleteFavorite(user.uid, recipeId);
        setFavorites((prev) => prev.filter((r) => r.id !== recipeId));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to remove favorite.");
      }
    },
    [user]
  );

  return { favorites, loading, error, removeFavorite };
}
