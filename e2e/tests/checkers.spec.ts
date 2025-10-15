import { expect, test } from '@playwright/test';
import { CheckersPage } from '../pages/CheckersPage';

test.describe('Checkers Page', () => {
  const titleText = "Checkers";
  const startGameMessage = "Select an orange piece to move.";
  const moveMsg = "Make a move";
  const selectedGif = "you1.gif";
  const unSelectedGif = "you2.gif";

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

  test('Validates my moves can be played - Happy Path', async ({ page }) => {
    for (const [index, move] of myMoves.entries()) {
      await test.step(`Move ${index + 1}: ${move.start} → ${move.end}`, async () => {
        await checkersPage.moveMyPieceAndWaitForMsg(move.start, move.end, moveMsg, unSelectedGif, selectedGif);
      });
    }
  });
});