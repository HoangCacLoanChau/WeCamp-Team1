import Page from "../page";

class ProductPage extends Page {
  ///
  get quantityDropdown() {}

  async open(id) {
    await super.open(`product/${id}`);
  }
  async openHomePage() {
    await super.open("");
  }
}

export default new ProductPage();
