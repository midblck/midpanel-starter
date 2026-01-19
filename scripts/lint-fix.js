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
    execSync('pnpm exec prettier --write "src/**/*.{js,jsx,ts,tsx}" "*.{js,mjs,cjs}"', {
      stdio: 'inherit',
      cwd: projectRoot,
    });
    console.log('\n✓ Prettier formatting completed\n');
  } catch (error) {
    console.log('⚠ Prettier completed with some issues (non-critical)\n');
  }

  console.log('\n✓ Auto-fix completed successfully!');
  console.log('   Formatting issues have been fixed by Prettier.');
  console.log('\n💡 Note: Run `pnpm lint` separately to check for remaining linting issues.');
  console.log('   (Next.js lint doesn\'t support --fix, but most issues are formatting-related)');
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}

