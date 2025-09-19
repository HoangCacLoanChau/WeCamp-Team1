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
}

export default new ProductPage();
