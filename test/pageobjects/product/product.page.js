import Page from "../page";

class ProductPage extends Page {
  ///
  get quantityDropdown() {
    return $("select.form-control");
  }

  get addToCartBtn() {
    return $("button=Add To Cart");
  }
  async selectQuantity(qty = 1) {
    await this.quantityDropdown.waitForDisplayed();
    await this.quantityDropdown.selectByVisibleText(qty.toString());
  }
  //add to cart
  async addToCart() {
    await this.addToCartBtn.waitForDisplayed();
    const isEnabled = await this.addToCartBtn.isEnabled();
    if (!isEnabled) {
      throw new Error("Add to Cart button is disabled (Out of Stock).");
    }
    await this.addToCartBtn.click();
  }
  async open(id) {
    await super.open(`product/${id}`);
  }
  async openHomePage() {
    await super.open("");
  }
  // stock check

  // Get stock status text
  get stockStatus() {
    return $(
      "#root > main > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > div > div:nth-child(2)",
    );
  }
  async getStockText() {
    const el = await this.stockStatus;
    return await el.getText();
  }

  async isAddToCartEnabled() {
    return await this.addToCartBtn.isEnabled();
  }
}

export default new ProductPage();
