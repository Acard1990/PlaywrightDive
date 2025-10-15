import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CheckersPage extends BasePage {
  private readonly _title: Locator;
  private readonly _message: Locator;
  private readonly _restartLink: Locator;
  private readonly _rulesLink: Locator;
  private readonly _url = "https://www.gamesforthebrain.com/game/checkers/";

  constructor(page: Page) {
    super(page);
    this._title = page.locator('h1');
    this._message = page.locator('#message');
    this._restartLink = page.locator("text=Restart");
    this._rulesLink = page.locator('a[href="https://en.wikipedia.org/wiki/English_draughts#Starting_position"]');
  }

  get title() {
    return this._title.textContent();
  }

  get message() {
    return this._message.textContent();
  }

  getMessageLocator(msg: string) {
    return this.page.locator(`#message:has-text("${msg}")`);
  }

  async goto() {
    await this.navigateTo(this._url);
    return this;
  }

  async clickRestartLink() {
    await this._restartLink.click();
  }

  async clickRulesLink() {
    await this._rulesLink.click();
    await expect(this.page).toHaveURL('https://en.wikipedia.org/wiki/English_draughts#Starting_position');
  }

  async getBoardState() {
    const els = await this.page.locator('#board div.line img').elementHandles();
    const items = await Promise.all(
      els.map(async (el) => {
        const name = (await el.getAttribute('name')) ?? '';
        const src = (await el.getAttribute('src')) ?? '';
        return { name, src };
      })
    );
    // Keep a solid order by square name
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }

  // diff the board state to ensure opponent has moved their piecce
  async waitForBoardChange(prev) {
    await this.page.waitForFunction(
      (prevSerialized) => {
        const imgs = Array.from(document.querySelectorAll('#board div.line img'));
        const now = imgs
          .map(el => ({ name: el.getAttribute('name') || '', src: el.getAttribute('src') || '' }))
          .sort((a, b) => a.name.localeCompare(b.name));
        return JSON.stringify(now) !== prevSerialized;
      },
      JSON.stringify(prev),
      { timeout: 10_000 }
    );
  }
}