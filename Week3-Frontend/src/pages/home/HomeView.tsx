import { Header } from "../../components/Header/Header";
import { RecipeCard } from "../../components/RecipeCard/RecipeCard";
import { useHomeViewModel } from "./useHomeViewModel";
import "./Home.css";

export function HomeView() {
  const {
    query,
    setQuery,
    recipes,
    favoriteIds,
    loading,
    error,
    handleSearch,
    loadInitialRecipes,
    handleToggleFavorite,
  } = useHomeViewModel();

  return (
    <>
      <Header
        query={query}
        onQueryChange={setQuery}
        onSearch={handleSearch}
        onHomeClick={loadInitialRecipes}
      />
      <main className="home-view">
        <div className="home-view__intro">
          <h1>Find something worth cooking tonight.</h1>
          <p>Search any dish, or browse today's shuffled picks below.</p>
        </div>

        {loading && <p className="home-view__status">Loading recipes…</p>}
        {error && <p className="home-view__status home-view__status--error">{error}</p>}

        {!loading && !error && recipes.length === 0 && (
          <p className="home-view__status">No recipes found. Try a different search.</p>
        )}

        <div className="home-view__grid">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorite={favoriteIds.has(recipe.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      </main>
    </>
  );
}
