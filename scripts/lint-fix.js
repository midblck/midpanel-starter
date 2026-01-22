#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

process.chdir(projectRoot);

try {
  console.log('🔧 Running Prettier to fix formatting issues...\n');

  // First, run Prettier to fix formatting issues
  try {
    execSync(
      'pnpm exec prettier --write "src/**/*.{js,jsx,ts,tsx,json,md}" "*.{js,mjs,cjs,json,md}"',
      {
        stdio: 'inherit',
        cwd: projectRoot,
      }
    );
    console.log('\n✓ Prettier formatting completed\n');
  } catch (error) {
    console.log('⚠ Prettier completed with some issues (non-critical)\n');
  }

  console.log('🔧 Running ESLint to fix linting issues...\n');

  // Then run ESLint with --fix
  try {
    execSync('pnpm exec eslint --fix "src/**/*.{js,jsx,ts,tsx}"', {
      stdio: 'inherit',
      cwd: projectRoot,
    });
    console.log('\n✓ ESLint fixes completed\n');
  } catch (error) {
    console.log('⚠ ESLint completed with some issues (non-critical)\n');
  }

  console.log('\n✅ Auto-fix completed successfully!');
  console.log('   Code has been formatted and linted.');
  console.log('\n💡 Run `pnpm ci:check` to verify everything passes.');
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
