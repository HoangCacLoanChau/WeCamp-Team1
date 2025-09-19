import Page from "../page";

class CartPage extends Page {
  get cartIcon() {
    return $("a[href='/cart']");
  }

  get cartIconCount() {
    return $(".badge.rounded-pill.bg-success");
  }
  get checkOutBtn() {
    return $("button=Proceed To Checkout");
  }
  async cartItems() {
    const container = await $(".list-group.list-group-flush"); // first cart container
    return await container.$$(".list-group-item");
  }

  async cartItem(index = 0) {
    const items = await this.cartItems();
    if (!items || items.length === 0) {
      throw new Error("No items in the cart");
    }
    return items[index];
  }

  async productImage(index = 0) {
    const item = await this.cartItem(index);
    return await item.$("img");
  }

  async productName(index = 0) {
    const item = await this.cartItem(index);
    return await item.$("a");
  }

  async productPrice(index = 0) {
    const item = await this.cartItem(index);
    return await item.$(".col-md-2:nth-child(3)");
  }

  async productQuantityDropdown(index = 0) {
    const item = await this.cartItem(index);
    return await item.$("select.form-control");
  }

  async deleteButton(index = 0) {
    const item = await this.cartItem(index);
    return await item.$("button.btn-light");
  }
  // subtotal
  get subtotalH2() {
    return $(".list-group.list-group-flush .list-group-item h2");
  }
  async getSubtotalQuantity() {
    const text = await this.subtotalH2.getText(); // "Subtotal (3) items"
    // Extract number between parentheses
    return parseInt(text.split("(")[1].split(")")[0], 10);
  }
  // subtotal price
  async getSubtotalPrice() {
    const text = await this.subtotalH2.parentElement().getText(); // "Subtotal (3) items\n$1799.97"
    // Take last line and remove $
    const lines = (await text).split("\n");
    return parseFloat(lines[lines.length - 1].replace("$", ""));
  }

  // Actions
  async selectQuantity(qty, index = 0) {
    const dropdown = await this.productQuantityDropdown(index);
    await dropdown.selectByVisibleText(String(qty));
  }

  async deleteItem(index = 0) {
    const btn = await this.deleteButton(index);
    await btn.click();
  }

  async openCart() {
    await this.clickNavbarTogglerIfVisible();
    const icon = await this.cartIcon;
    await icon.waitForClickable();
    await icon.click();
  }
}

export default new CartPage();
