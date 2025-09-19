// POM: Profile Page
import Page from "../page";

class ProfilePage extends Page {
  // ===== selectors =====
  get nameInput() { return $("#name"); }
  get emailInput() { return $("#email"); }
  get passwordInput() { return $("#password"); }
  get confirmPasswordInput() { return $("#confirmPassword"); }
  get updateButton() { return $("#root > main > div > div > div.col-md-3 > form > button"); }
  get toast() { return $(".Toastify__toast-body div:nth-child(2)"); }

  // ===== actions =====
  async open() {
    // /profile trong app ProShop
    await super.open("profile");
  }

  async updateProfile({ name, email, password, confirmPassword } = {}) {
    // name & email có thể đã có sẵn -> clear trước khi gõ lại
    if (name !== undefined) {
      await this.nameInput.clearValue();
      await this.nameInput.setValue(name);
    }
    if (email !== undefined) {
      await this.emailInput.clearValue();
      await this.emailInput.setValue(email);
    }
    if (password !== undefined) {
      await this.passwordInput.setValue(password);
    }
    if (confirmPassword !== undefined) {
      await this.confirmPasswordInput.setValue(confirmPassword);
    }
    await this.updateButton.click();
  }
}

export default new ProfilePage();