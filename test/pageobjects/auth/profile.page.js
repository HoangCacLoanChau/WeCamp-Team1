// POM: Profile Page
import Page from "../page";

class ProfilePage extends Page {
  get nameInput() { return $('#name'); }
  get emailInput() { return $('#email'); }
  get passwordInput() { return $('#password'); }
  get confirmPasswordInput() { return $('#confirmPassword'); }
  get saveBtn() { return $('#root > main > div > div > div.col-md-3 > form > button'); }

  async open() {
    await super.open("profile");
  }

  async updateProfile({ name, email }) {
    await this.nameInput.click();
    await this.nameInput.clearValue();
    await this.nameInput.setValue(name);

    await this.emailInput.click();
    await this.emailInput.clearValue();
    await this.emailInput.setValue(email);

    await this.saveBtn.click();
}
}

export default new ProfilePage();