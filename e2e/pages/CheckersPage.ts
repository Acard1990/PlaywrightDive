import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CheckersPage extends BasePage {
    private readonly _title: Locator;

    constructor(page: Page) {
        super(page);
        this._title = this.page.locator('h1');
    }

    get title() {
        return this._title.textContent();
    }

    async goto() {
        await this.navigateTo('https://www.gamesforthebrain.com/game/checkers/');
        return this;
    }

}