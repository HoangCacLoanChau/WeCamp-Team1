import ProductPage from "../../pageobjects/product/product.page";

describe("View product", () => {
  it("should open homepage with a list of all product", async () => {
    await ProductPage.openHomePage();
    // check if there container
    await expect(ProductPage.productListContainer).toBeExisting();
    // Check list has at least 1 item
    await expect(ProductPage.productItems).toBeElementsArrayOfSize({ gte: 1 });
  });
  it("should open homepage a list of top 3 product as slider", async () => {
    await ProductPage.openHomePage();
  });
});
