import ProductPage from "../../pageobjects/product/product.page";

describe("product functionality", () => {
  it("should open homepage with a list of all product", async () => {
    await ProductPage.openHomePage();
    await expect(ProductPage.productListContainer).toBeExisting();
  });
});
