# CLAUDE.md

This file gives Claude Code (or any AI assistant working in this repo) context on the project, stack, and conventions to follow.

## Project

Capstone project for the AI-assisted development track. Scope and product description are still being finalized — update this section once locked in.

## Tech Stack

- **Language:** JavaScript / TypeScript
- **Runtime:** Node.js (LTS)
- **Package manager:** npm
- **Frontend:** TBD
- **Backend:** TBD
- **Database:** TBD
- **Testing:** TBD

## Conventions

### Commits
This repo uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):
- `feat: ...` — new feature
- `fix: ...` — bug fix
- `docs: ...` — documentation only
- `chore: ...` — tooling, config, maintenance
- `refactor: ...` — code change that neither fixes a bug nor adds a feature
- `test: ...` — adding or updating tests

### Code Style
- Use `camelCase` for variables and functions, `PascalCase` for components/classes.
- Prefer named exports over default exports.
- Keep functions small and single-purpose.
- Add comments only where intent isn't obvious from the code.

### File Structure
- Keep source code in `src/`.
- Keep tests colocated with source files or in a mirrored `tests/` directory (TBD).

## Commands

- `npm install` — install dependencies
- `npm run dev` — run locally in dev mode
- `npm test` — run tests
- `npm run build` — build for production

## Notes for the AI Assistant

- Ask before making large structural changes.
- Favor readability over cleverness.
- When adding a new dependency, briefly explain why it's needed.
