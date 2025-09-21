class PaypalPage {
  get emailField() {
    return $('//input[@id="email"]');
  }
  get btnNext() {
    return $('//button[@id="btnNext"]');
  }
  get passwordField() {
    return $('#//input[@id="password"]');
  }
  get btnLogin() {
    return $('//button[@id="btnLogin"]');
  }
  get btnCompletePurchase() {
    return $(
      '//button[@class="Buttons_base_2xi07 CheckoutButton_noMargin_mv-3h Buttons_rebrandTreatment1_3-eCu xo-member-c72rwi-button_base-text_button_lg-btn_full_width"]',
    );
  }

  async switchToPaypal() {
    await browser.switchWindow("sandbox.paypal.com");
  }

  async login(email, password) {
    await this.switchToPaypal();
    await this.emailField.waitForDisplayed();
    await this.emailField.setValue(email);
    await this.btnNext.click();
    await this.passwordField.waitForDisplayed();
    await this.passwordField.setValue(password);
    await this.btnLogin.click();
  }

  async completePurchase() {
    await this.switchToPaypal();
    await this.btnCompletePurchase.click();
    await browser.switchWindow("localhost:3000");
  }

  async cancelAndReturn() {
    await this.switchToPaypal();
    await browser.closeWindow();
    await browser.switchWindow("localhost:3000");
  }
}
export default new PaypalPage();
