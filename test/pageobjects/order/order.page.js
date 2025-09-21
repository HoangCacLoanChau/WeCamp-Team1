class OrderPage {
  get header() {  return $('h1'); }
  get paymentStatus() {  return $('//h2[text()="Payment Method"]/following::div[contains(@class,"alert")][1]'); }
  get btnPaypal() {  return $('//div[contains(@data-funding-source,"paypal")] | //div[contains(@class,"paypal-button")]'); }
  get iframePaypal() { return $('iframe[src*="paypal.com"]'); 
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
}
export default new OrderPage();