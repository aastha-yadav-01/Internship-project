import { useAuthViewModel } from "./useAuthViewModel";
import "./Auth.css";

export function AuthView() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    mode,
    loading,
    error,
    toggleMode,
    handleSubmit,
  } = useAuthViewModel();

  const isLogin = mode === "login";

  return (
    <main className="auth-view">
      <form className="auth-view__card" onSubmit={handleSubmit}>
        <h1>{isLogin ? "Welcome back" : "Create your account"}</h1>
        <p className="auth-view__subtitle">
          {isLogin
            ? "Sign in to see and save your favorite recipes."
            : "Save recipes to come back to any time."}
        </p>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isLogin ? "current-password" : "new-password"}
            required
          />
        </label>

        {error && <p className="auth-view__error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Please wait…" : isLogin ? "Sign in" : "Create account"}
        </button>

        <button type="button" className="auth-view__toggle" onClick={toggleMode}>
          {isLogin ? "Need an account? Register" : "Already have an account? Sign in"}
        </button>
      </form>
    </main>
  );
}
