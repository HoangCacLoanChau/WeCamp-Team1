import HomePage from "../../pageobjects/home.page";
import CartPage from "../../pageobjects/product/cart.page";
import ProductPage from "../../pageobjects/product/product.page";

describe(" Edit cart", () => {
  it("TCPO_07: Verify that a user can successfully edit a product in the cart", async () => {
    // Add a product with an initial quantity.
    const initialQuantity = 3;
    await HomePage.open();
    await HomePage.waitForProductListToLoad();
    await HomePage.openProductbyIndex(0);
    await ProductPage.setProductQuantity(initialQuantity);
    await ProductPage.clickAddToCartButton();

    // Verify initial cart state.
    await expect(await CartPage.getSubtotalQuantity()).toBe(initialQuantity);

    //  Update the quantity field.
    const newQuantity = 6;
    const productPriceText = await CartPage.getProductPriceByIndex(0);
    const productPrice = parseFloat(productPriceText.replace("$", ""));

    await CartPage.editProductQuantity(0, newQuantity);

    // Verify the quantity field is updated.
    const updatedProductQty = await CartPage.getProductQuantityByIndex(0);
    await expect(updatedProductQty).toEqual(newQuantity.toString());

    //  Verify the subtotal and total price are updated.
    const updatedSubtotalQty = await CartPage.getSubtotalQuantity();
    await expect(updatedSubtotalQty).toBe(newQuantity);

    const expectedTotalPrice = Number((productPrice * newQuantity).toFixed(2));
    const actualTotalPrice = await CartPage.getSubtotalPrice();
    await expect(actualTotalPrice).toBeCloseTo(expectedTotalPrice, 2);
    await browser.execute(() => {
      localStorage.removeItem("cart");
    });
  });
  it("TCPO_08: Verify a user can successfully remove a product from the cart", async () => {
    // Add a product with an initial quantity.
    const initialQuantity = 1;
    await HomePage.open();
    await HomePage.waitForProductListToLoad();
    await HomePage.openProductbyIndex(0);
    await ProductPage.setProductQuantity(initialQuantity);
    await ProductPage.clickAddToCartButton();

    // Verify initial cart state.
    await expect(await CartPage.getSubtotalQuantity()).toBe(initialQuantity);

    await CartPage.removeProductByIndex(0);

    // Step 4: Verify the product is removed and the cart is empty.
    await expect(CartPage.emptyCartMessage).toBeDisplayed({ timeout: 5000 });
    await expect(await CartPage.emptyCartMessage.getText()).toEqual("Your cart is empty Go Back");

    await expect(await CartPage.getSubtotalQuantity()).toBe(0);
    await expect(await CartPage.getSubtotalPrice()).toBe(0);
  });
});
