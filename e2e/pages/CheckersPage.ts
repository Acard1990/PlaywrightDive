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

  async getChipsByOwner(owner: string) {
    // Locate all the <img> elements within div.line inside #board
    const elements = await this.page.locator('#board div.line img').elementHandles();

    const chips = await Promise.all(
      elements.map(async (el) => ({
        src: (await el.getAttribute('src')) ?? '',
        name: await el.getAttribute('name'),
        onClick: await el.getAttribute('onclick'),
      }))
    );
    // Filter chips by the owner
    const chiparoos = chips.filter((c) => c.src.includes(`${owner}.gif`));
    console.log(`Enemy pieces: ${JSON.stringify(chiparoos)}`);
    return chiparoos;
  }

  async moveMyPieceAndWaitForMsg(start: number, end: number, msg: string, unselectedGif: string, selectedGif: string) {
    // // Validate unselected orange piece before clicking
    await expect(this.page.locator(`[name="space${start}"]`)).toHaveAttribute('src', unselectedGif);
    await this.page.locator(`[name="space${start}"]`).click({ delay: 1000 });
    // Validate orange piece is selected after click
    await expect(this.page.locator(`[name="space${start}"]`)).toHaveAttribute('src', selectedGif);
    await this.page.locator(`[name="space${end}"]`).click({ delay: 1000 });
    // Validate unselected orange piece state after move
    await expect(this.page.locator(`[name="space${end}"]`)).toHaveAttribute('src', unselectedGif);
    await this.getMessageLocator(msg).isVisible();
  }
}