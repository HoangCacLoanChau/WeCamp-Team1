class OrderPage {
  get header() { return $('h1'); }
  get paymentStatus() { return $('/html[1]/body[1]/div[1]/div[1]/div[1]/div[1]'); }
  get btnPaypal() { return $('//div[contains(@data-funding-source,"paypal")]'); }

  async open(orderId) {
    await browser.url(`/order/${orderId}`);
  }

  async clickContinueToPaypal() {
    await this.btnPaypal.click();
  }
}
export default new OrderPage();