import { defineConfig } from '@playwright/test';
import baseConfig from './base.config';

export default defineConfig({
	...baseConfig,
	testMatch: [
		'tests/productPage/example.spec.ts'
	]
});
