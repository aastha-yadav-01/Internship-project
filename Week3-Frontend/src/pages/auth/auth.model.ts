import { registerUser, loginUser, logoutUser } from "../../services/authService";
import type { User } from "firebase/auth";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function validateCredentials(email: string, password: string): void {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }
}

export async function register(email: string, password: string): Promise<User> {
  const normalized = normalizeEmail(email);
  validateCredentials(normalized, password);
  return registerUser(normalized, password);
}

export async function login(email: string, password: string): Promise<User> {
  const normalized = normalizeEmail(email);
  validateCredentials(normalized, password);
  return loginUser(normalized, password);
}

export async function logout(): Promise<void> {
  return logoutUser();
}
