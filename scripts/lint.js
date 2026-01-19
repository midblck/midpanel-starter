#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

process.chdir(projectRoot);

try {
  // Use npx to run next lint, which should handle arguments correctly
  // The .eslintignore file limits linting to src directory
  execSync('npx --no-install next lint', {
    stdio: 'inherit',
    cwd: projectRoot,
    env: {
      ...process.env,
      NODE_OPTIONS: '--no-deprecation',
    },
  });
} catch (error) {
  process.exit(error.status || 1);
}

