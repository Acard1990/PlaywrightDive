import { expect, test } from '@playwright/test';
import { CheckersPage } from '../pages/CheckersPage';

test.describe('Checkers Page', () => {
  let checkersPage: CheckersPage;
  test.beforeEach(async ({ page }) => {
    checkersPage = new CheckersPage(page);
    await checkersPage.goto();
  });

  test('should have expected title', async () => {
    await expect(await checkersPage.title).toBe("Checkers");
  });
});