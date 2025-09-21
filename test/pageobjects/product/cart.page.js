import Page from "../page";

class CartPage extends Page {
  // Page element selectors
  get cartItems() {
    return $$(".list-group-item .row");
  }

  async getSubtotalQuantity() {
    const headerText = await $("h2*=Subtotal").getText();
    const matches = headerText.match(/\((\d+)\)/);

    if (matches && matches[1]) {
      return parseInt(matches[1], 10);
    }
    return 0; // Returns 0 if no number is found.
  }
  get emptyCartMessage() {
    return $('[role="alert"]');
  }

  get checkoutButton() {
    return $(".btn-block");
  }

  get subtotalCard() {
    return $(".col-md-4 .card");
  }

  async getSubtotalPrice() {
    const text = await this.subtotalCard.getText();

    // Find the text that starts with a dollar sign
    const match = text.match(/\$(\d+\.?\d*)/);

    if (match && match[1]) {
      return parseFloat(match[1]);
    }
    return 0;
  }
  // A reusable method to get a specific cart item element
  async getProductInCartByIndex(index) {
    const cartItems = await this.cartItems;
    return cartItems[index];
  }

  // Get the product name by index
  async getProductNameByIndex(index) {
    const item = await this.getProductInCartByIndex(index);
    return item.$(".col-md-3 a").getText();
  }

  // Get the product price by index
  async getProductPriceByIndex(index) {
    const item = await this.getProductInCartByIndex(index);
    return item.$(".col-md-2:nth-child(3)").getText();
  }

  // Get the product quantity by index
  async getProductQuantityByIndex(index) {
    const item = await this.getProductInCartByIndex(index);
    return item.$("select.form-control").getValue();
  }
  async editProductQuantity(index, quantity) {
    const item = await this.getProductInCartByIndex(index);
    const quantitySelect = await item.$("select.form-control");

    await quantitySelect.selectByVisibleText(quantity.toString());
  }

  // Get the product delete button by index
  async getProductDeleteButtonByIndex(index) {
    const item = await this.getProductInCartByIndex(index);
    return item.$(".btn.btn-light");
  }
  async removeProductByIndex(index) {
    const deleteButton = await this.getProductDeleteButtonByIndex(index);
    await deleteButton.click();

    // Add a wait to ensure the page has updated after deletion
    await browser.waitUntil(
      async () => {
        const cartItems = await this.cartItems;
        return cartItems.length === 0;
      },
      { timeout: 5000, timeoutMsg: "Expected cart to be empty after removing the item." },
    );
  }

  // Click the checkout button
  async clickCheckout() {
    await this.checkoutButton.click();
  }

  async open() {
    await super.open("cart");
  }
}

export default new CartPage();
