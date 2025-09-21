class PaypalPage {
  get emailField() { return $('#email'); }
  get btnNext() { return $('#btnNext'); }
  get passwordField() { return $('#password'); }
  get btnLogin() { return $('#btnLogin'); }
  get linkGuestLogin() { return $('//a[normalize-space()="Log In"]'); }
  get btnCompletePurchase() {  return $('//button[contains(text(),"Pay") or contains(text(),"Purchase") or contains(text(),"Continue")]'); }
  get btnAcceptCookies() { return $('//button[normalize-space()="Yes, I accept"]'); }

  async switchToPaypal() {
    await browser.waitUntil(
      async () => (await browser.getWindowHandles()).length > 1,
      { timeout: 20000, timeoutMsg: 'PayPal popup did not open' }
    );
    const handles = await browser.getWindowHandles();
    await browser.switchToWindow(handles[1]);
  }

  async backToApp() {
    const handles = await browser.getWindowHandles();
    await browser.switchToWindow(handles[0]);
  }

  async tryClickGuestLogin() {
    try {
      const found = await this.linkGuestLogin.waitForDisplayed({ timeout: 20000 });
      if (found) {
        await this.linkGuestLogin.scrollIntoView();
        await this.linkGuestLogin.click();
      }
    } catch (err) {}
  }

  async acceptCookiesIfVisible() {
    try {
      if (await this.btnAcceptCookies.isDisplayed()) {
        await this.btnAcceptCookies.click();
        await browser.pause(500);
      }
    } catch (err) {}
  }

  async login(email, password) {
    await this.switchToPaypal();
    await this.tryClickGuestLogin();

    await this.emailField.waitForDisplayed({ timeout: 20000 });
    await this.emailField.setValue(email);

    await this.btnNext.waitForClickable({ timeout: 10000 });
    await this.btnNext.click();

    await this.passwordField.waitForDisplayed({ timeout: 20000 });
    await this.passwordField.setValue(password);

    await this.acceptCookiesIfVisible();

    await this.btnLogin.waitForClickable({ timeout: 10000 });
    await this.btnLogin.click();
  }

  async completePurchase() {
    await this.switchToPaypal();
    await this.btnCompletePurchase.waitForDisplayed({ timeout: 20000 });
    await this.btnCompletePurchase.click();
    await this.backToApp();
  }
  async cancelAndReturn() {
    await this.switchToPaypal();
    await browser.closeWindow();
    await this.backToApp();
  }
}

export default new PaypalPage();