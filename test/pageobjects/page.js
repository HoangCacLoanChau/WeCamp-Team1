export default class Page {
  async open(path) {
    await browser.url(`http://localhost:3000/${path}`);
  }
  //---- if screen with < 992
  get navbarToggler() {
    return $(".navbar-toggler");
  }

  // common function for all POMs
  async clickNavbarTogglerIfVisible() {
    if (await this.navbarToggler.isExisting()) {
      if (await this.navbarToggler.isDisplayed()) {
        await this.navbarToggler.click();
      }
    }
  }
  //----------------------------------------------
}
