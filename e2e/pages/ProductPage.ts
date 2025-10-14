import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";


type InventoryItem = {
	description: string;
	name: string;
	image: { height: number, width: number };
	price: string;
	button: Locator;
}

export class ProductPage extends BasePage {
	private readonly _title: Locator;
	private readonly _shoppingCartLink: Locator;
	private readonly _inventoryItemLink: string = 'inventory-item'

	constructor(page: Page) {
		super(page);
		this._title = this.page.getByTestId('title');
		this._shoppingCartLink = this.page.getByTestId('shopping-cart-link');
	}

	get title() {
		return this._title.textContent();
	}

	get shoppingCartLink() {
		return this._shoppingCartLink;
	}

	async getAllInventoryItems(): Promise<InventoryItem[]> {
		const rawItems = await this.page.getByTestId(this._inventoryItemLink).all();
		expect(rawItems.length).toBeGreaterThan(0);
		const items = rawItems.map(async (item) => {
			const description = await item.getByTestId('inventory-item-desc').textContent();
			const name = await item.getByTestId('inventory-item-name').textContent();
			const imageBox = await item.locator('img[data-test^="inventory-item-"]').boundingBox();
			const image = { width: imageBox?.width, height: imageBox?.height };
			const price = await item.getByTestId('inventory-item-price').textContent();
			const button = item.getByText(/add to cart/i);
			return { description, name, image, price, button } as InventoryItem;
		});
		return await Promise.all(items);
	}

	async goto() {
		await this.navigateTo('/inventory.html');
		return this;
	}

}