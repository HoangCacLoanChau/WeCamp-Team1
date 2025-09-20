import Page from "./page";

class HomePage extends Page {
  async open() {
    await super.open("");
  }
  get cartIconCount() {
    return $(".badge");
  }

  // Profile
  get userMenu() {
    return $("#username");
  }

  get navbarToggler() {
    return $(".navbar-toggler");
  }

  get profileMenuItem() {
    return $(".dropdown-menu a[href='/profile']");
  }

  get logoutMenuItem() {
    return $("#basic-navbar-nav > div > div.nav-item.show.dropdown > div > a:nth-child(2)");
  }
  async logOut() {
    if (await this.navbarToggler.isDisplayed()) {
      await this.navbarToggler.click();
    }
    await (await this.userMenu).waitForClickable();
    await (await this.userMenu).click();
    await (await this.logoutMenuItem).waitForClickable();
    await (await this.logoutMenuItem).click();
  }
  async navigateToProfile() {
    if (await this.navbarToggler.isDisplayed()) {
      await this.navbarToggler.click();
    }
    await (await this.userMenu).waitForClickable();
    await (await this.userMenu).click();
    await (await this.profileMenuItem).waitForClickable();
    await (await this.profileMenuItem).click();
  }

  // Product list
  get productCards() {
    return $$(".card");
  }
  async waitForProductListToLoad() {
    // Wait for at least one card to exist
    await $(".card").waitForExist({ timeout: 5000 });
  }
  // Gets a specific product card by its index
  async getProductCardByIndex(index) {
    const allCards = await this.productCards;
    return allCards[index];
  }

  async getProductHrefByIndex(index) {
    const productCard = await this.getProductCardByIndex(index);
    const productLink = await productCard.$('a[href^="/product/"]');
    return productLink.getAttribute("href");
  }

  async openProductbyIndex(index) {
    const productCard = await this.getProductCardByIndex(index);
    const productLink = await productCard.$('a[href^="/product/"]');
    await productLink.click();
  }
}

export default new HomePage();
