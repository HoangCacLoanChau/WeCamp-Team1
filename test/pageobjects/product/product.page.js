import Page from "../page";

class ProductPage extends Page {
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
  async open(id) {
    await super.open(`product/${id}`);
  }
  async openHomePage() {
    await super.open("");
  }
}

export default new ProductPage();
