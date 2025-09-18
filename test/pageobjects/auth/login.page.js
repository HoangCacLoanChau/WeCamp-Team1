import Page from '../page';

class LoginPage extends Page {
  get emailInput() {
    return $('#email');
  }
  get passwordInput() {
    return $('#password');
  }
  get toast() {
    return $('.Toastify__toast-body div:nth-child(2)');
  }
  get loginButton() {
    return $('button.btn.btn-primary');
  }

  async login(email, password) {
    await this.emailInput.setValue(email);
    await this.passwordInput.setValue(password);
    await this.loginButton.click();
  }

  async open() {
    await super.open('login');
  }
}

export default new LoginPage();
