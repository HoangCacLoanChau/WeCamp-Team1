import Page from "../page";

class ProductPage extends Page {
  get productListContainer() {
    return $("#root > main > div > div.row");
  }
  async open(id) {
    await super.open(`product/${id}`);
  }
  async openHomePage() {
    await super.open("");
  }
}

export default new ProductPage();
