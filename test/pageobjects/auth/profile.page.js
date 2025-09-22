import Page from "../page";

class ProfilePage extends Page {
  get nameInput() {
    return $("#name");
  }
  get emailInput() {
    return $("#email");
  }
  get passwordInput() {
    return $("#password");
  }
  get confirmPasswordInput() {
    return $("#confirmPassword");
  }
  get saveBtn() {
    return $("#root > main > div > div > div.col-md-3 > form > button");
  }

  // Toast message hiển thị thông báo thành công/ password missmatch
  get toastMessage() {
    return $('//div[contains(text(),"Profile updated successfully")]');
  }
  get toastMessageFail() {
    return $('//div[contains(text(),"Passwords do not match")]');
  }

  // clear and type
  async clearAndType(el, value) {
    await el.click();
    await el.clearValue();
    await el.setValue(value);
  }

  // nhận object như đang dùng trong spec
  async updateProfile({ name, email, password, confirmPassword } = {}) {
    if (name !== undefined) await this.clearAndType(this.nameInput, name);
    if (email !== undefined) await this.clearAndType(this.emailInput, email);
    if (password !== undefined) await this.clearAndType(this.passwordInput, password);
    if (confirmPassword !== undefined)
      await this.clearAndType(this.confirmPasswordInput, confirmPassword);
    await this.saveBtn.click();
    // await browser.pause(800);
  }

  async getOriginalProfile() {
    return {
      name: await this.nameInput.getValue(),
      email: await this.emailInput.getValue(),
    };
  }

  // lấy thông báo validate HTML5 (cho những case lỗi)
  async getEmailValidationMessage() {
    return await this.emailInput.getProperty("validationMessage");
  }

  async open() {
    await super.open("profile");
  }
  // order history
  // Selectors for the entire order history table and its rows
  get orderHistoryTable() {
    return $("table.table-sm");
  }

  get orderListRows() {
    return this.orderHistoryTable.$$("tbody tr");
  }

  // A flexible selector to find a row based on a specific order ID
  async getRowByOrderId(orderId) {
    return this.orderHistoryTable.$(`//tr[td[normalize-space()="${orderId}"]]`);
  }

  // A method to get the payment status for a specific order ID
  async getPaidStatus(orderId) {
    const row = await this.getRowByOrderId(orderId);
    if (!row) return null;
    const paidCell = await row.$("td:nth-child(4)");
    // Checks if the cell contains a date string, indicating it's paid.
    const cellText = await paidCell.getText();
    return cellText.length > 0 ? "Paid" : "Not Paid";
  }

  // A method to get the delivery status for a specific order ID
  async getDeliveredStatus(orderId) {
    const row = await this.getRowByOrderId(orderId);
    if (!row) return null;
    const deliveredCell = await row.$("td:nth-child(5)");
    // Checks if the cell contains an SVG icon (red 'X' means not delivered)
    const hasDeliveredIcon = await deliveredCell.$("svg").isExisting();
    return hasDeliveredIcon ? "Not Delivered" : "Delivered";
  }

  // A method to click the details button for a specific order ID
  async clickDetailsButton(orderId) {
    const row = await this.getRowByOrderId(orderId);
    if (row) {
      await row.$("a.btn-light").click();
    }
  }
}
export default new ProfilePage();
