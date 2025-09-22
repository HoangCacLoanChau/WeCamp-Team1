import Page from "../page";

class PlaceOrderPage extends Page {
  /**
   * Define selectors for elements on the Place Order page.
   */
  get pageTitle() {
    return $("h1=Place Order");
  }

  // Selector for the entire shipping details paragraph, including the address text
  get shippingDetailsParagraph() {
    return $('//h2[text()="Shipping"]/following-sibling::p');
  }
  async getShippingAddress() {
    const fullText = await this.shippingDetailsParagraph.getText();
    return fullText.replace("Address:", "").trim();
  }
  get shippingPrice() {
    // Finds the element immediately following the 'Shipping' label
    return $('//div[text()="Shipping"]/following-sibling::div');
  }
  async getShippingPrice() {
    const text = await this.shippingPrice.getText();
    return parseFloat(text.replace("$", ""));
  }
  get paymentMethod() {
    return $('//h2[text()="Payment Method"]/following-sibling::strong');
  }

  // A more robust selector to find the order items list.
  // This will return an array of all the list-group-item rows.
  get orderItemsList() {
    return $$(".list-group-item .row");
  }

  get orderSummary() {
    return $(".card");
  }

  get placeOrderButton() {
    return $("button=Place Order");
  }

  /**
   * A method to get a specific order item.
   * @param {number} index - The index of the item.
   * @returns {Promise<WebdriverIO.Element>} The element for the order item.
   */
  async getOrderItemByIndex(index) {
    return this.orderItemsList[index];
  }

  /**
   * Gets the price of the items from the order summary.
   * @returns {Promise<number>} The items price as a number.
   */
  async getItemsPrice() {
    const text = await $('//div[text()="Items"]/following-sibling::div').getText();
    return parseFloat(text.replace("$", ""));
  }

  async getTaxPrice() {
    const text = await $('//div[text()="Tax"]/following-sibling::div').getText();
    return parseFloat(text.replace("$", ""));
  }

  /**
   * Get the total price from the order summary.
   */
  async getTotalPrice() {
    const totalText = await $('//div[text()="Total"]/following-sibling::div').getText();
    const price = totalText.replace("$", "");
    return parseFloat(price);
  }

  async getOrderItemNameByIndex(index) {
    const itemElement = await this.getOrderItemByIndex(index);
    return itemElement.$(".col a").getText();
  }

  async getOrderItemQtyByIndex(index) {
    const itemElement = await this.getOrderItemByIndex(index);
    const priceString = await itemElement.$(".col-md-4").getText();
    const match = priceString.match(/(\d+)/);
    return parseInt(match[1], 10);
  }

  async getOrderItemTotalPriceByIndex(index) {
    const item = await this.getOrderItemByIndex(index);
    if (!item) return 0;
    const text = await item.$(".col-md-4").getText();
    const match = text.match(/=\s*\$(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  }
  async getOrderItemPriceByIndex(index) {
    const itemElement = await this.getOrderItemByIndex(index);
    if (!itemElement) return 0;
    const priceString = await itemElement.$(".col-md-4").getText();
    const match = priceString.match(/\$\s*(\d+\.?\d*)\s*=/);
    return match ? parseFloat(match[1]) : 0;
  }
  /**
   * Click the "Place Order" button.
   */
  async clickPlaceOrderButton() {
    await this.placeOrderButton.waitForDisplayed();
    await this.placeOrderButton.click();
  }

  /**
   * Open the Place Order page directly.
   */
  async open() {
    await super.open("placeorder");
  }
}

export default new PlaceOrderPage();
