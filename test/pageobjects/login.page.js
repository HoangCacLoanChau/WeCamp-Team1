import Page from "./page";

class LoginPage extends Page {
  get emailInput() {
    return $("#email");
  }
  get passwordInput() {
    return $("#password");
  }
  get loginButton() {
    return $("#root > main > div > div > div > div > form > button");
  }

  async login(email, password) {
    await this.emailInput.setValue(email);
    await this.passwordInput.setValue(password);
    await this.loginButton.click();
  }

  async open() {
    await super.open("login");
  }
}

export default new LoginPage();
