import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Header/Header";
import { RecipeCard } from "../../components/RecipeCard/RecipeCard";
import { useFavoritesViewModel } from "./useFavoritesViewModel";
import "./Favorites.css";

export function FavoritesView() {
  const { favorites, loading, error, removeFavorite } = useFavoritesViewModel();
  const navigate = useNavigate();
  // Header still needs search props even on this screen, so it behaves the
  // same everywhere; a search here just takes the user back to Home with results.
  const [query, setQuery] = useState("");

  return (
    <>
      <Header
        query={query}
        onQueryChange={setQuery}
        onSearch={() => navigate(`/?search=${encodeURIComponent(query)}`)}
        onHomeClick={() => {}}
      />
      <main className="favorites-view">
        <h1>Your favorites</h1>

        {loading && <p className="favorites-view__status">Loading your favorites…</p>}
        {error && <p className="favorites-view__status favorites-view__status--error">{error}</p>}

        {!loading && !error && favorites.length === 0 && (
          <p className="favorites-view__empty">
            Nothing saved yet. Head to Home and tap the heart on a recipe you like.
          </p>
        )}

        <div className="favorites-view__grid">
          {favorites.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorite
              onToggleFavorite={() => removeFavorite(recipe.id)}
            />
          ))}
        </div>
      </main>
    </>
  );
}
