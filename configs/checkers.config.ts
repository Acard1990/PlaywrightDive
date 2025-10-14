import { defineConfig } from '@playwright/test';
import path from 'path';

const testDir = path.resolve(__dirname, '..', 'e2e'); // <— absolute path

console.log('Using testDir:', testDir);

export default defineConfig({
  testDir,
  testMatch: ['tests/checkers.spec.ts'], // matches e2e/tests/checkers.spec.ts
});