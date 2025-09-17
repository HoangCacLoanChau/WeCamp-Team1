import Page from "../page";

class HomePage extends Page {
  // dropdown hiển thị tên user
  get userMenu() { return $('#username'); }
  // item Profile trong dropdown
  get profileMenuItem() { return $('#basic-navbar-nav > div > div > div > a:nth-child(1)'); }  
  // item Logout trong dropdown
  get logoutMenuItem() { return $('#basic-navbar-nav > div > div > div > a:nth-child(2)'); }

  async open() {
    await super.open("");
  }

  async navigateToProfile() {
    await this.userMenu.waitForClickable();
    await this.userMenu.click();
    await this.profileMenuItem.waitForClickable();
    await this.profileMenuItem.click();
  }
}

export default new HomePage();
