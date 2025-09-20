import Page from "../page";

class ProfilePage extends Page {
  get nameInput()             { return $('#name'); }
  get emailInput()            { return $('#email'); }
  get passwordInput()         { return $('#password'); }
  get confirmPasswordInput()  { return $('#confirmPassword'); }
  get saveBtn()               { return $('#root > main > div > div > div.col-md-3 > form > button'); }

  // Toast message hiển thị thông báo thành công/ password missmatch
  get toastMessage() {
    return $('//div[contains(text(),"Profile updated successfully")]'); 
  }
  
// clear and type
 async clearAndType(el, value) {
    await el.click();
    await el.clearValue();
    await el.setValue(value);
  }

  // nhận object như đang dùng trong spec
  async updateProfile({ name, email, password, confirmPassword } = {}) {
    if (name !== undefined)            await this.clearAndType(this.nameInput, name);
    if (email !== undefined)           await this.clearAndType(this.emailInput, email);
    if (password !== undefined)        await this.clearAndType(this.passwordInput, password);
    if (confirmPassword !== undefined) await this.clearAndType(this.confirmPasswordInput, confirmPassword);
    await this.saveBtn.click();
    await browser.pause(800);
  }

  async getOriginalProfile() {
    return {
      name:  await this.nameInput.getValue(),
      email: await this.emailInput.getValue(),
    };
  }

  // lấy thông báo validate HTML5 (cho những case lỗi)
  async getEmailValidationMessage() {
    return await this.emailInput.getProperty('validationMessage');
  }

  async open() { await super.open('profile'); }
}
export default new ProfilePage();