# Recipe Vault

A small React + TypeScript app for discovering recipes (via [TheMealDB](https://www.themealdb.com/api.php)),
signing in, and saving favorites to your own profile (via Firebase Authentication +
Realtime Database). Built as an internship assignment, following the same
prompt-driven, MVVM-based workflow demonstrated in the mentor session on
React + AI-assisted development.

See `PROMPTS.md` for the full log of prompts used, how AI assisted at each
step, and specific manual fixes made after reviewing the generated code.

## Features

- Browse a shuffled set of recipes on load, search by dish name
- View recipe cards with image, category, and cuisine
- Register / log in with email + password (Firebase Auth)
- Save and remove favorites, scoped to your own account (Firebase Realtime DB)
- Favorites route is protected — signed-out users are redirected to `/auth`

## Architecture

Each screen follows an MVVM split, same pattern for every page:

```
pages/<screen>/
  <screen>.model.ts        # data + business logic, no React
  use<Screen>ViewModel.ts  # React state + actions (the hook)
  <Screen>View.tsx         # renders UI using the hook, no direct API/Firebase calls
  <Screen>.css
```

```
src/
  components/       # Header, RecipeCard (presentational, reusable)
  context/          # AuthContext — exposes current Firebase user app-wide
  routes/           # ProtectedRoute — guards /favorites
  services/         # mealDbService, firebaseService, authService — all I/O lives here
  pages/            # home, favorites, auth (each in MVVM form above)
  types/            # shared TS types
```

## Getting started

1. **Install dependencies**
   ```
   npm install
   ```

2. **Get a MealDB key** — not required. The app ships pointing at TheMealDB's
   free public test key (`1`), which works out of the box for search and lookup.

3. **Create a Firebase project** (only needed for login/favorites):
   - Go to [Firebase console](https://console.firebase.google.com), create a project
   - Add a Web app, copy the config values
   - Enable **Authentication → Sign-in method → Email/Password**
   - Enable **Realtime Database** (start in test mode for local dev)

4. **Configure environment variables**
   ```
   cp .env.example .env
   ```
   Fill in the `VITE_FIREBASE_*` values from your Firebase project settings.

5. **Run the dev server**
   ```
   npm run dev
   ```

6. **Build for production**
   ```
   npm run build
   ```

## Notes on Firebase security rules

The Realtime Database is used in test mode by default (open read/write). For
anything beyond local development, lock it down so a user can only read/write
their own `favorites/{uid}` node, e.g.:

```json
{
  "rules": {
    "favorites": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```
