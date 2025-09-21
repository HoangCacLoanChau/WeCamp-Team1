class OrderPage {
  get header() {
    return $("h1");
  }
  get paymentStatus() {
    return $('//h2[text()="Payment Method"]/following::div[contains(@class,"alert")][1]');
  }
  get btnPaypal() {
    return $(
      '//div[contains(@data-funding-source,"paypal")] | //div[contains(@class,"paypal-button")]',
    );
  }
  get iframePaypal() {
    return $('iframe[src*="paypal.com"]');
  }

  async open(orderId) {
    await browser.url(`/order/${orderId}`);
  }

  async clickContinueToPaypal() {
    if (await this.iframePaypal.isExisting()) {
      await this.iframePaypal.waitForDisplayed({ timeout: 20000 });
      await browser.switchToFrame(await this.iframePaypal);

      const btn = await $('//div[contains(@class,"paypal-button")]');
      await btn.waitForDisplayed({ timeout: 20000 });
      await btn.click();

      await browser.switchToParentFrame();
    } else {
      await this.btnPaypal.waitForDisplayed({ timeout: 20000 });
      await this.btnPaypal.click();
    }
  }
  //shipping

  /**
   * sub page containing specific selectors and methods for a specific page
   */
  get shippingAddressElement() {
    // A more robust selector to find the paragraph that contains the "Address:" label
    return $("p*=Address:");
  }

  get paymentMethod() {
    return $('//h2[text()="Payment Method"]/following-sibling::p');
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
   * Gets the shipping address from the shipping details.
   * @returns {Promise<string>} The shipping address as a string.
   */
  async getShippingAddress() {
    const fullText = await this.shippingAddressElement.getText();
    return fullText.replace("Address:", "").trim();
  }

  /**
   * Gets the price of the items from the order summary.
   * @returns {Promise<number>} The items price as a number.
   */
  async getItemsPrice() {
    const text = await $('//div[text()="Items"]/following-sibling::div').getText();
    return parseFloat(text.replace("$", ""));
  }

  /**
   * Gets the shipping price from the order summary.
   * @returns {Promise<number>} The shipping price as a number.
   */
  async getShippingPrice() {
    const text = await $('//div[text()="Shipping"]/following-sibling::div').getText();
    return parseFloat(text.replace("$", ""));
  }

  /**
   * Gets the tax price from the order summary.
   * @returns {Promise<number>} The tax price as a number.
   */
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

  /**
   * Get the name of an order item by its index.
   * @param {number} index - The index of the item.
   * @returns {Promise<string>} The name of the item.
   */
  async getOrderItemNameByIndex(index) {
    const itemElement = await this.getOrderItemByIndex(index);
    return itemElement.$(".col a").getText();
  }

  /**
   * Get the quantity of an order item by its index.
   * @param {number} index - The index of the item.
   * @returns {Promise<number>} The quantity of the item.
   */
  async getOrderItemQtyByIndex(index) {
    const itemElement = await this.getOrderItemByIndex(index);
    const priceString = await itemElement.$(".col-md-4").getText();
    const match = priceString.match(/(\d+)/);
    return parseInt(match[1], 10);
  }

  /**
   * Get the total price of a single order item by its index.
   * @param {number} index - The index of the item.
   * @returns {Promise<number>} The total price of the item.
   */
  async getOrderItemTotalPriceByIndex(index) {
    const item = await this.getOrderItemByIndex(index);
    if (!item) return 0;
    const text = await item.$(".col-md-4").getText();
    const match = text.match(/=\s*\$(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Get the unit price of a single order item by its index.
   * @param {number} index - The index of the item.
   * @returns {Promise<number>} The unit price of the item.
   */
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
    await this.placeOrderButton.click();
  }

  /**
   * Open the Order page directly.
   */
  async open() {
    await super.open("order/:id");
  }
}
export default new OrderPage();
