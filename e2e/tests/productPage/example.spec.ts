import { expect, test } from '@playwright/test';
import { ProductPage } from '../../pages/ProductPage';

test.describe('product page', () => {
  let productPage: ProductPage;
  test.beforeEach(async ({ page }) => {
    productPage = new ProductPage(page);
    await productPage.goto();
  });

  test('has title and shopping cart link', async () => {
    await expect(await productPage.title).toBe("Products");
    await expect(productPage.shoppingCartLink).toBeVisible();
  });

  test('shows a list of items on the page', async () => {
    const items = await productPage.getAllInventoryItems();
    for (let item of items) {
      expect(item.description.length).toBeGreaterThan(10);
      expect(item.image.height).toBeGreaterThan(0);
      expect(item.image.width).toBeGreaterThan(0);
      expect(item.name.length).toBeGreaterThan(10);
      expect(item.price).toMatch(/\$\d+\.\d{2}/);
      expect(item.button).toBeEnabled();
    }
  });

});