import Page from "./page";

class HomePage extends Page {
  get imageLink() {
    return $("#root > main > div > div.row > div:nth-child(1) > div > a");
  }
  get nameLink() {
    return $("#root > main > div > div.row > div:nth-child(1) > div > div > a");
  }

  async clickLink(link) {
    await this.imageLink.click();
  }
  async openHomePage() {
    await super.open("");
  }
}

export default new HomePage();
