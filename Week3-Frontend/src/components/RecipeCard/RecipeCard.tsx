import type { Recipe } from "../../types/recipe";
import "./RecipeCard.css";

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onToggleFavorite: (recipe: Recipe) => void;
}

export function RecipeCard({ recipe, isFavorite, onToggleFavorite }: RecipeCardProps) {
  return (
    <article className="recipe-card">
      <div className="recipe-card__image-wrap">
        {recipe.thumbnail ? (
          <img src={recipe.thumbnail} alt={recipe.title} loading="lazy" />
        ) : (
          <div className="recipe-card__image-fallback">No image</div>
        )}
        <button
          className={`recipe-card__fav ${isFavorite ? "is-active" : ""}`}
          onClick={() => onToggleFavorite(recipe)}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? "♥" : "♡"}
        </button>
      </div>
      <div className="recipe-card__body">
        <span className="recipe-card__tag">{recipe.category}</span>
        <h3>{recipe.title}</h3>
        <p className="recipe-card__area">{recipe.area} cuisine</p>
      </div>
    </article>
  );
}
