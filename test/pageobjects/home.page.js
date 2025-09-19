import Page from "./page";

class HomePage extends Page {
  async open() {
    await super.open("");
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
    return $(".dropdown-menu a=Logout");
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
  async productListContainer() {
    return await $("#root > main > div > div.row");
  }

  async allProductLinks() {
    const container = await this.productListContainer();
    await container.waitForDisplayed({ timeout: 5000 });
    return await container.$$("div > div a[href*='/product/']");
  }

  async getProductHref(index = 0) {
    const links = await this.allProductLinks();
    if (!links || links.length === 0) {
      throw new Error("No product links found on page");
    }
    if (index < 0 || index >= links.length) {
      throw new Error(`Product index ${index} is out of bounds`);
    }
    return await links[index].getAttribute("href");
  }

  async openProduct(index = 0) {
    const links = await this.allProductLinks();
    if (!links || links.length === 0) {
      throw new Error("No product links found on page");
    }
    if (index < 0 || index >= links.length) {
      throw new Error(`Product index ${index} is out of bounds`);
    }
    const productLink = links[index];
    await productLink.waitForDisplayed({ timeout: 5000 });
    await productLink.click();
  }
}

export default new HomePage();
