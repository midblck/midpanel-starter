#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

process.chdir(projectRoot);

console.log('🚀 Setting up development environment...\n');

try {
  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('pnpm install', { stdio: 'inherit', cwd: projectRoot });

  // Set up husky
  console.log('🔗 Setting up git hooks...');
  try {
    execSync('pnpm exec husky init', { stdio: 'inherit', cwd: projectRoot });
  } catch (error) {
    console.log('ℹ️  Husky already initialized or not needed');
  }

  // Run initial formatting
  console.log('🎨 Running initial code formatting...');
  execSync('pnpm format', { stdio: 'inherit', cwd: projectRoot });

  console.log('\n✅ Development environment setup complete!');
  console.log('\n📝 Available commands:');
  console.log('   pnpm dev          - Start development server');
  console.log('   pnpm format       - Format code with Prettier');
  console.log('   pnpm lint:fix     - Auto-fix linting issues');
  console.log('   pnpm ci:check     - Run full CI checks');
  console.log('\n🎯 Code formatting will run automatically:');
  console.log('   • On save (in supported editors)');
  console.log('   • Before commits (git hooks)');
  console.log('   • In CI/CD pipelines');
} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}
