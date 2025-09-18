import Page from "../page";

class ProfilePage extends Page {
  get nameInput() { return $('#name'); }
  get emailInput() { return $('#email'); }
  get passwordInput() { return $('#password'); }
  get confirmPasswordInput() { return $('#confirmPassword'); }
  get saveBtn() { return $('button[type="submit"]'); }
  get toast() { return $('Toastify__toast Toastify__toast-theme--light Toastify__toast--success Toastify__toast--close-on-click'); }

  async updateProfile({ name, email }) {
    if (name !== undefined) {
      await this.nameInput.waitForDisplayed({ timeout: 5000 });
      await this.nameInput.click();
      await this.nameInput.clearValue();
      await this.nameInput.setValue(name);
    }

    if (email !== undefined) {
      await this.emailInput.waitForDisplayed({ timeout: 5000 });
      await this.emailInput.click();
      await this.emailInput.clearValue();
      await this.emailInput.setValue(email);
    }

    await this.saveBtn.waitForClickable({ timeout: 5000 });
    await this.saveBtn.click();
    await this.toast.waitForDisplayed({ timeout: 5000 });
  }

  async getOriginalProfile() {
    await this.nameInput.waitForDisplayed({ timeout: 5000 });
    const name = await this.nameInput.getValue();
    const email = await this.emailInput.getValue();
    return { name, email };
  }
}

export default new ProfilePage();