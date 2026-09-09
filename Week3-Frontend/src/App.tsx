import { Routes, Route } from "react-router-dom";
import { HomeView } from "./pages/home/HomeView";
import { FavoritesView } from "./pages/favorites/FavoritesView";
import { AuthView } from "./pages/auth/AuthView";
import { ProtectedRoute } from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeView />} />
      <Route path="/auth" element={<AuthView />} />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <FavoritesView />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
