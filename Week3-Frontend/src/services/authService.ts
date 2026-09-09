import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth } from "./firebaseService";

const NOT_CONFIGURED_MESSAGE =
  "Sign-in isn't set up yet — add your Firebase keys to .env (see README.md).";

function requireAuth() {
  if (!auth) {
    throw new Error(NOT_CONFIGURED_MESSAGE);
  }
  return auth;
}

function readableAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/invalid-email":
      return "That email address doesn't look right.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    default:
      return "Something went wrong with authentication. Please try again.";
  }
}

export async function registerUser(email: string, password: string): Promise<User> {
  try {
    const credential = await createUserWithEmailAndPassword(requireAuth(), email, password);
    return credential.user;
  } catch (err) {
    throw new Error(err instanceof Error && !("code" in err) ? err.message : readableAuthError(err));
  }
}

export async function loginUser(email: string, password: string): Promise<User> {
  try {
    const credential = await signInWithEmailAndPassword(requireAuth(), email, password);
    return credential.user;
  } catch (err) {
    throw new Error(err instanceof Error && !("code" in err) ? err.message : readableAuthError(err));
  }
}

export async function logoutUser(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}

/**
 * Subscribes to Firebase auth state changes. If Firebase isn't configured,
 * immediately reports "no user" once instead of leaving the caller waiting
 * forever — this is what stops the app from getting stuck on a loading
 * screen when .env is empty.
 */
export function subscribeToAuthChanges(callback: (user: User | null) => void): () => void {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}
