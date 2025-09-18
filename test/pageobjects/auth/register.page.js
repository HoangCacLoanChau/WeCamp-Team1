import Page from '../page';

class RegisterPage extends Page {
  get nameInput() {
    return $('#name');
  }
  get emailInput() {
    return $('#email');
  }
  get passwordInput() {
    return $('#password');
  }
  get confirmPasswordInput() {
    return $('#confirmPassword');
  }
  get toast() {
    return $('.Toastify__toast-body div:nth-child(2)');
  }
  get registerButton() {
    return $('button=Register');
  }

  async register(name, email, password, confirmPassword) {
    await this.nameInput.setValue(name);
    await this.emailInput.setValue(email);
    await this.passwordInput.setValue(password);
    await this.confirmPasswordInput.setValue(confirmPassword);
    await this.registerButton.click();
  }

  async open() {
    await super.open('register');
  }
}

export default new RegisterPage();
