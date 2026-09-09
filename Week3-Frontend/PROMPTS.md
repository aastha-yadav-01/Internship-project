# Prompts & AI-Assisted Development Log — Recipe Vault

> This log follows the same granular, scoped-prompt workflow demonstrated in
> the mentor session (small, single-responsibility prompts, one layer of the
> app at a time, bugs fixed with the actual error pasted back in). If you run
> this same sequence yourself in Cursor (or another AI coding tool), your
> outputs will vary slightly — update this file with what actually happened
> in your own session, including any extra back-and-forth. That's the point
> of the assignment: this file is a template of the *process*, not a script
> to copy verbatim.

## 1. Project initialization

**Prompt:**
> Initialize a new React application using Vite + React + TypeScript. Use
> functional components only. Do not install any UI library and do not add
> any feature functionality yet — only the default project.

**AI output:** scaffolded a standard Vite React-TS project (App.tsx,
main.tsx, default counter demo, default styles).

**Follow-up prompt:**
> Remove all default Vite content, images, styles, and demo code. Leave a
> minimal working React application with an empty App component. Do not
> create any additional components yet.

## 2. Header component

**Prompt:**
> Create a reusable Header component. It should contain a Home navigation
> link, a Favorites navigation link, a search input, and a search button.
> Use React Router links for navigation. Only create and display the header
> — do not create the Home or Favorites screens yet, and do not connect the
> search input to any functionality yet.

**AI output:** `Header.tsx` + `Header.css`, wired into `App.tsx`.

**Issue hit:** missing `react-router-dom` dependency threw an error on
render. Fixed by pasting the exact error back into the next prompt and
asking AI to install the missing package and restart.

## 3. MVVM skeleton per screen

**Prompt (repeated for Home, Favorites, Auth):**
> Create the empty MVVM file structure for the `<screen>` screen: `<screen>.model.ts`,
> `use<Screen>ViewModel.ts`, `<Screen>View.tsx`. The model should contain
> screen-specific data and business logic (no React). The view model will
> later hold React state and actions. The view will later render the
> interface. Create only minimal placeholder exports so the app compiles —
> do not add API requests, React state, or UI yet.

**Why:** keeping data access, state, and rendering in three separate files
per screen makes each piece independently testable and easy to review —
same reasoning as the mentor session.

## 4. Recipe API service (no API key needed)

**Prompt:**
> Create `mealDbService.ts`. Implement `searchRecipes(query)` using TheMealDB's
> `search.php` endpoint, read the API key from the env variable, encode the
> query, normalize the raw response into a shared `Recipe` type, and throw a
> readable error when the request fails. Do not use React hooks, do not use
> `useEffect`, do not manage loading state here.

**Manual correction after review:** the first draft of the normalizer used
a `for...in` loop over the raw MealDB object to collect ingredients, which
also picked up unrelated keys (`strMeal`, `strCategory`, etc.) because
those keys partially matched a loose string check. Rewrote it as an
explicit bounded loop (`for i = 1 to 20`) checking `strIngredient${i}` /
`strMeasure${i}` directly — safer and matches the API's documented shape
instead of guessing from key names.

## 5. Home model — business logic

**Prompt:**
> Implement `home.model.ts`. Export `getRecipes(query)`: trim the query,
> validate it has at least 2 characters, call `searchRecipes`, return the
> list. Export `getInitialRecipes()`: since TheMealDB has no "browse all"
> endpoint, fetch recipes for a few random seed letters in parallel with
> `Promise.all`, merge results, de-duplicate by `id`, shuffle, and return 20.
> Do not use React hooks, do not call `fetch` directly.

## 6. Home view model + view

**Prompt (view model):**
> Implement `useHomeViewModel`. Manage `query`, `recipes`, `loading`, `error`,
> `favoriteIds` with `useState`. Add `handleSearch` and `loadInitialRecipes`
> that call the model, set loading/error appropriately, and reset on
> completion. Do not render JSX here, do not call the API service directly.

**Prompt (view):**
> Implement `HomeView`. Use `useHomeViewModel`. Render the search input bound
> to `query`, call `handleSearch` on submit, show a loading message while
> loading, an error message when present, and the recipe grid otherwise using
> `.map`. Do not call any service directly from this file.

**Bug found manually:** clicking "Home" after a search left the previous
search results on screen instead of reloading the shuffled list — the
Header's Home link only navigated, it didn't re-trigger data loading.

**Fix prompt:**
> When a user searches, then clicks Home, nothing reloads. Home should
> re-run `loadInitialRecipes`. Wire an `onHomeClick` prop through Header
> that calls it.

## 7. Favorites — Firebase-backed

**Prompt (service):**
> Add `addFavoriteRecipe`, `removeFavoriteRecipe`, `getFavoriteRecipes` to
> `firebaseService.ts`. Use the recipe id as the key under
> `favorites/{userId}/{recipeId}` in Realtime Database. Throw readable
> errors on failure. Do not use React hooks.

**Prompt (model → view model → view):** same three-step pattern as Home,
scoped one file at a time, each with an explicit "do not call Firebase
directly from this file" boundary so the layering stays honest.

**Manual refactor after generation:** the AI's first pass named the
favorites-removal function `removeMovie` (a leftover naming pattern
from following the original movie-app session too closely while adapting
it to recipes). Renamed to `removeFavorite` across the hook and view for
clarity, since this app has nothing to do with movies.

**Manual fix — cross-page search:** the Favorites page's header search
originally used `window.location.href = ...` to jump back to Home with a
query, which forces a full page reload and drops React state unnecessarily.
Replaced with `useNavigate` from `react-router-dom`, and added a `?search=`
param read on Home's mount so the query still carries over — same user
behavior, no full reload.

## 8. Authentication (Firebase Auth) + protected routes

**Prompt sequence** (same shape as steps 4–7, applied to auth):
1. Firebase Auth service: `registerUser`, `loginUser`, `logoutUser`,
   `subscribeToAuthChanges`, converting Firebase error codes into readable
   messages.
2. `auth.model.ts`: trims/normalizes email, validates password length ≥ 6,
   delegates to the service.
3. `useAuthViewModel`: manages `email`, `password`, `mode` (login/register),
   `loading`, `error`; `handleSubmit` branches on mode; clears password on
   success and navigates home.
4. `AuthView`: controlled form, disables submit while loading, toggle
   between login/register.
5. `AuthContext` + `ProtectedRoute`: subscribes to Firebase auth state once
   at the app root, exposes `user`/`authLoading`/`logout`; `ProtectedRoute`
   redirects unauthenticated users hitting `/favorites` to `/auth`.

**Manual check after generation:** verified the auth listener unsubscribes
on unmount (`useEffect` cleanup returns the `onAuthStateChanged` unsubscribe
function) — an easy thing for a generated hook to skip and cause a memory
leak / state update on an unmounted component warning.

## How AI assisted overall

- **Scaffolding speed:** generated the Vite/TS project setup, boilerplate
  component structure, and repetitive MVVM file trios far faster than
  writing them by hand.
- **API integration:** handled the fiddly parts of TheMealDB's response
  shape (numbered ingredient/measure fields) and Firebase SDK calls
  correctly on the first or second try once given a tightly scoped prompt.
- **Debugging:** pasting actual error messages back into the next prompt
  (missing package, 401 from a bad key, unwired button) resolved issues
  faster than searching docs from scratch.
- **Consistency:** kept the same file-naming and layering convention across
  three near-identical screens (Home/Favorites/Auth) without having to
  manually enforce it each time.

## Manual improvements summary (see inline notes above for detail)

1. Rewrote the MealDB ingredient normalizer to use a bounded, explicit loop
   instead of a loose key-matching loop.
2. Renamed `removeMovie` → `removeFavorite` (leftover naming from adapting
   the reference movie-app pattern to a recipe app).
3. Replaced a `window.location.href` full-page-reload navigation with
   React Router's `useNavigate` + a `?search=` param, preserving app state.
4. Verified/confirmed the Firebase auth listener cleanup to avoid a leak.
5. Wired `onHomeClick` through Header so returning to Home actually resets
   the recipe list instead of leaving stale search results on screen.
