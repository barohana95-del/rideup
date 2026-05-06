// =====================================================================
// build-deploy.mjs
//
// Builds the frontend and stages the output at the repo root so that
// Hostinger's Git auto-deploy ships them to public_html alongside the
// PHP backend.
//
// Layout after running:
//   /index.html                       (SPA shell)
//   /assets/...                       (built JS + CSS)
//   /fonts/, /images/                 (anything under frontend/public/)
//   /api/, /lib/, /migrations/        (PHP backend, untouched)
//
// Usage:  node scripts/build-deploy.mjs
//         or:  npm run deploy   (top-level package.json)
// =====================================================================
import { execSync } from 'node:child_process';
import { rmSync, cpSync, existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT     = path.resolve(__dirname, '..');
const FRONTEND = path.join(ROOT, 'frontend');
const DIST     = path.join(FRONTEND, 'dist');

function log(msg) { console.log(`\n▸ ${msg}`); }

// ── 1. Build ──────────────────────────────────────────────────────────
log('Building frontend (vite build)...');
execSync('npm run build', { cwd: FRONTEND, stdio: 'inherit' });

if (!existsSync(DIST)) {
  console.error('✗ Build did not produce frontend/dist. Aborting.');
  process.exit(1);
}

// ── 2. Clean previous staged artifacts ────────────────────────────────
log('Cleaning previous staged artifacts at repo root...');

// Files / dirs that came from a previous build → remove cleanly
const stagedPath = path.join(ROOT, 'index.html');
if (existsSync(stagedPath)) rmSync(stagedPath);

// Anything under frontend/public/ becomes a top-level dir after build.
// We list what's currently in dist to know what to clean (excluding
// reserved backend dirs).
const RESERVED = new Set([
  'api', 'lib', 'migrations', 'docs', 'frontend', 'scripts', 'node_modules',
  '.git', '.github',
]);

for (const entry of readdirSync(DIST)) {
  const target = path.join(ROOT, entry);
  if (RESERVED.has(entry)) continue; // never delete backend dirs
  if (existsSync(target)) {
    rmSync(target, { recursive: true, force: true });
  }
}

// ── 3. Stage fresh dist to repo root ──────────────────────────────────
log('Staging fresh build to repo root...');
for (const entry of readdirSync(DIST)) {
  if (RESERVED.has(entry)) {
    console.warn(`  (skipping reserved name: ${entry})`);
    continue;
  }
  const src = path.join(DIST, entry);
  const dst = path.join(ROOT, entry);
  cpSync(src, dst, { recursive: true });
  const isDir = statSync(src).isDirectory();
  console.log(`  + ${entry}${isDir ? '/' : ''}`);
}

log('Done. Run:');
console.log('    git add -A && git commit -m "Deploy: build frontend" && git push');
console.log('  Then trigger deploy in Hostinger hPanel → Git.');
