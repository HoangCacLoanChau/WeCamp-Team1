import Page from "../page";

class AdminOrderPage extends Page {
  get btnMarkDelivered() {
    return $('//button[normalize-space()="Mark As Delivered"]');
  }
  get deliveryStatus() {
    return $("/html[1]/body[1]/div[1]/main[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]");
  }

  async openOrder(orderId) {
    await super.open(`order/${orderId}`);
  }

  async markDelivered() {
    await this.btnMarkDelivered.waitForDisplayed({ timeout: 20000 });
    await this.btnMarkDelivered.click();
  }
}
export default new AdminOrderPage();
