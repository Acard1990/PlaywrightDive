import path from 'path';
import { test } from '../utils/customTest';

const authFile = path.join(__dirname, '..', '.auth/user.json');

test('authenticate', async ({ page, username, password }) => {
	await page.goto('/');
	await page.getByTestId('username').fill(username);
	await page.getByTestId('password').fill(password);
	await page.getByTestId('login-button').click();

	await page.waitForURL('/inventory.html');

	await page.context().storageState({ path: authFile })
});