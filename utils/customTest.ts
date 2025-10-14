import { test as base } from '@playwright/test';

export type SetupTestOptions = {
	username: string;
	password: string
};

export const test = base.extend<SetupTestOptions>({
	username: ['', { option: true }],
	password: ['', { option: true }]
});