import Page from "./page";

class HomePage extends Page {
  //profile
  // dropdown hiển thị tên user
  get userMenu() {
    return $("#username");
  }
  // if screen hamberger showed
  get navbarToggler() {
    return $(".navbar-toggler");
  }
  // item Profile trong dropdown
  get profileMenuItem() {
    return $(".dropdown-menu a[href='/profile']");
  }
  // item Logout trong dropdown
  get logoutMenuItem() {
    return $(".dropdown-menu a=Logout");
  }

  async open() {
    await super.open("");
  }

  async navigateToProfile() {
    if (await this.navbarToggler.isDisplayed()) {
      await this.navbarToggler.click();
    }
    await this.userMenu.waitForClickable();
    await this.userMenu.click();
    await this.profileMenuItem.waitForClickable();
    await this.profileMenuItem.click();
  }

  //product list
  get productListContainer() {
    return $("#root > main > div > div.row");
  }
  get productItems() {
    return $("#root > main > div > div.row > div:nth-child(1)");
  }
  get sliderProductContainer() {
    return $("#root > main > div > div.bg-primary.mb-4.carousel.slide");
  }
  get sliderProductItem() {
    return $(
      "#root > main > div > div.bg-primary.mb-4.carousel.slide > div.carousel-inner > div.carousel-item",
    );
  }
  get allProductLinks() {
    return $$("a[href*='/product/']");
  }
  get firstProductLink() {
    return this.allProductLinks[0];
  }

  async openFirstProduct() {
    await this.getFirstProductHref(); // ensures it exists
    await this.firstProductLink.click();
  }
  //get first item
  async getFirstProductHref() {
    await browser.waitUntil(async () => (await this.allProductLinks.length) > 0, {
      timeout: 5000,
      timeoutMsg: "No product links found on page",
    });
    return await this.firstProductLink.getAttribute("href");
  }
}

export default new HomePage();
