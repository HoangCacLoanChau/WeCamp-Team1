class AdminOrderPage {
  get btnMarkDelivered() { return $('//button[normalize-space()="Mark As Delivered"]'); }
  get deliveryStatus() { return $('/html[1]/body[1]/div[1]/main[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]'); }

  async openOrder(orderId) {
    await browser.url(`/order/${orderId}`);
  }

  async markDelivered() {
    await this.btnMarkDelivered.click();
  }
}
export default new AdminOrderPage();