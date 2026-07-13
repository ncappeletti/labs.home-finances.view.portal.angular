# Design: Dev Container + Angular SPA Portal

**Date:** 2026-07-13  
**Repo:** `labs.home-finances.view.portal.angular`  
**Reference:** `labs.home-finances.api.gateway.dotnet/.devcontainer`

## Goal

Provide a VS Code / Cursor Dev Container so the Angular portal SPA can be developed without local Node/Angular dependencies, mirroring the gateway’s custom Dockerfile pattern. Also scaffold a minimal Angular 22 CSR app at the repo root.

## Decisions

| Topic | Choice |
|--------|--------|
| Scope | Dev container + initial Angular scaffold |
| Angular | Current major (22.x) |
| Node | 22 LTS (`node:22`, effective min `^22.22.3` for Angular 22) |
| Package manager | npm |
| App type | Classic SPA (CSR), no SSR |
| Style | CSS |
| Routing | Yes |
| Layout | App at repository root (not a subfolder) |
| Approach | Custom Dockerfile (same spirit as the .NET gateway) |

## Architecture

```
labs.home-finances.view.portal.angular/
├── .devcontainer/
│   ├── Dockerfile
│   └── devcontainer.json
├── .vscode/
│   └── tasks.json          # ng serve --host 0.0.0.0 --port 4200
├── .gitignore
├── package.json
├── angular.json
├── src/                    # Angular 22 CSR SPA
├── README.md
└── docs/superpowers/specs/
```

- **Workspace:** bind mount `${localWorkspaceFolder}` → `/workspace` (`consistency=cached`)
- **User:** non-root `vscode` (UID/GID 1000)
- **npm cache volume:** `home-finances-npm-cache` → `/home/vscode/.npm`
- **Forwarded port:** `4200`
- **Hot reload:** always set `CHOKIDAR_USEPOLLING=true` in `remoteEnv` for reliable watch on bind mounts

## Dockerfile

Base: `node:22`.

Steps aligned with the gateway image:

1. If a system user occupies UID/GID 1000 (e.g. `ubuntu` or `node` depending on the image), remove/adjust it so `vscode` can claim 1000.
2. Install `git`, `curl`, `ca-certificates`, `sudo`.
3. Create `vscode` with passwordless sudo.
4. Ensure `/home/vscode/.npm` exists and is owned by `vscode`.
5. `WORKDIR /workspace` owned by `vscode`.
6. Switch to `USER vscode`.

Do **not** pin a global `@angular/cli` in the image. Use project-local CLI via `npx` / `package.json` so the CLI version tracks the app.

## `devcontainer.json`

| Field | Value |
|--------|--------|
| `name` | `Home Finances Portal Angular` |
| `build.dockerfile` | `Dockerfile` |
| `build.context` | `..` |
| `remoteUser` | `vscode` |
| `workspaceFolder` | `/workspace` |
| `forwardPorts` | `[4200]` |
| `mounts` | npm cache volume as above |
| `postCreateCommand` | `sudo chown -R vscode:vscode /home/vscode/.npm && npm install` |
| Extensions | `angular.ng-template`, `dbaeumer.vscode-eslint` |
| `remoteEnv` | `CHOKIDAR_USEPOLLING=true` |

## Angular scaffold

Generate at repo root with Angular CLI 22 defaults for:

- Standalone components (CLI default)
- Routing enabled
- Style: CSS
- SSR: disabled
- Skip nested git init (`--skip-git`)

Command (adjust flag names only if CLI 22 differs; keep the same intent):

```bash
npx @angular/cli@22 new home-finances-portal --directory . \
  --routing \
  --style=css \
  --ssr=false \
  --skip-git \
  --defaults
```

Package / project name: `home-finances-portal`.

Include a standard Angular `.gitignore` (`node_modules`, `dist`, `.angular`, etc.).

## VS Code tasks

`.vscode/tasks.json` with a default/background-friendly task:

```text
ng serve --host 0.0.0.0 --port 4200
```

`--host 0.0.0.0` is required so the forwarded port is reachable from the host.

## README

Short instructions:

1. Open the folder in VS Code / Cursor.
2. Reopen in Container.
3. After `postCreateCommand`, run `npm start` or the `ng serve` task.
4. Open `http://localhost:4200`.

## Out of scope

- SSR
- Docker Compose linking the API gateway
- Auth / business features
- CI pipelines
- Mandatory Prettier config
- E2E (Playwright/Cypress) setup

## Success criteria

1. Opening the repo as a Dev Container builds without local Node on the host.
2. `npm install` completes via `postCreateCommand`.
3. `ng serve` is reachable on host port `4200`.
4. Repo contains a runnable Angular 22 CSR app with routing.
5. Pattern remains recognizable next to the .NET gateway `.devcontainer`.
