import { expect, test } from '@playwright/test';
import { CheckersPage } from '../pages/CheckersPage';

test.describe('Checkers Page', () => {
  const titleText = "Checkers";
  const startGameMessage = "Select an orange piece to move.";

  let checkersPage: CheckersPage;
  test.beforeEach(async ({ page }) => {
    checkersPage = new CheckersPage(page);
    await checkersPage.goto();
  });

  test('Validate the correct title', async () => {
    await expect(checkersPage.title).resolves.toContain(titleText);
  });

  test('Validate the start game message', async () => {
    await expect(checkersPage.message).resolves.toContain(startGameMessage);
  });

  test('Validate the Restart link', async () => {
    await checkersPage.clickRestartLink();
    await expect(checkersPage.message).resolves.toContain(startGameMessage);
  });

  test('Validate the Rules link', async () => {
    await checkersPage.clickRulesLink();
  });

  const myMoves = [
    { start: 62, end: 53 },
    { start: 22, end: 33 },
    { start: 71, end: 62 },
    { start: 31, end: 13 },
    { start: 62, end: 73 },
    { start: 51, end: 62 },
    { start: 11, end: 22 },
    { start: 60, end: 71 },
    { start: 40, end: 51 },
    { start: 20, end: 31 },
    { start: 53, end: 44 },
    { start: 62, end: 44 },
    { start: 13, end: 24 },
  ];

  test('Validate player can make a legitimate move', async ({ page }) => {
    const start = page.locator(`[name="space${myMoves[0].start}"]`);
    const end = page.locator(`[name="space${myMoves[0].end}"]`);

    await expect(start).toHaveAttribute('src', /you\d\.gif$/i);

    await start.click();
    await end.click();

    // asserts that the move happened by checking the src of the start element
    await expect(start).toHaveAttribute('src', /(blank|gray|empty)\.gif$/i);

    // asserts the piece is where we expect it to be
    await expect(end).toHaveAttribute('src', /you\d\.gif$/i);
  });

  test('Validate board does not change with invalid move', async ({ page }) => {
    const start = page.locator(`[name="space${myMoves[0].start}"]`);
    const end = page.locator(`[name="space${myMoves[3].end}"]`); // invalid move

    await expect(start).toHaveAttribute('src', /you\d\.gif$/i);

    await start.click();
    await end.click();

    // asserts that the move never happened by checking the src of the start element
    await expect(start).toHaveAttribute('src', /you\d\.gif$/i);

    // asserts the end located is still empty
    await expect(end).toHaveAttribute('src', /(blank|gray|empty)\.gif$/i);
  });

  test('Validate the board changes when the opponent should move', async ({ page }) => {
    const before = await checkersPage.getBoardState();

    const start = page.locator(`[name="space${myMoves[0].start}"]`);
    const end = page.locator(`[name="space${myMoves[0].end}"]`);
    await start.click();
    await end.click();

    // Wait for board to change after the opponent moves
    await checkersPage.waitForBoardChange(JSON.stringify(before));
  });
});