import HomePage from "../../pageobjects/home.page";
import ProductPage from "../../pageobjects/product/product.page";
import LoginPage from "../../pageobjects/auth/login.page";
import CartPage from "../../pageobjects/product/cart.page";
describe("Cart checkout and confirmation", () => {
  before(async () => {
    await browser.maximizeWindow();
  });
  afterEach(async () => {
    await browser.execute(() => {
      localStorage.removeItem("cart");
    });
  });
  it("TCPO_09: Verify a user can successfully proceed to checkout", async () => {
    // Step 1: Log in with a valid user.
    await LoginPage.open();
    await LoginPage.login("john@email.com", "123456");

    // Step 2: Navigate to the home page and add a product to the cart.
    await HomePage.open();
    await HomePage.waitForProductListToLoad();
    await HomePage.openProductbyIndex(0);

    // Select quantity and click "Add to Cart".
    const quantity = 2;
    await ProductPage.setProductQuantity(quantity);
    await ProductPage.clickAddToCartButton();

    // Verify the cart has the correct quantity before checkout.
    await expect(await CartPage.getSubtotalQuantity()).toBe(quantity);

    // Step 3: Click the "Proceed To Checkout" button.
    await CartPage.checkoutButton.click();

    // Step 4: Verify the browser navigates to the shipping page.
    await expect(browser).toHaveUrl(expect.stringContaining("/shipping"), { timeout: 5000 });
  });
  it("TCPO_10: Verify a user can checkout without logging in and keep their cart after login", async () => {
    // Step 1 & 2: Navigate to the homepage and add a product as an unauthenticated user.
    await HomePage.open();
    await HomePage.waitForProductListToLoad();
    await HomePage.openProductbyIndex(0);

    // Step 3 & 4: Select quantity and add to cart.
    const quantity = 3;
    await ProductPage.setProductQuantity(quantity);
    await ProductPage.clickAddToCartButton();

    // Verify cart icon count before checkout.
    await expect(await HomePage.cartIconCount.getText()).toBe(quantity.toString());
    // Step 5: Click "Proceed to checkout".
    await CartPage.clickCheckout();

    // Step 6: Verify the user is redirected to the login page.
    await expect(browser).toHaveUrl(expect.stringContaining("/login?redirect=/shipping"), {
      timeout: 5000,
    });

    // Step 7: Log in with valid credentials.
    const user = { email: "john@email.com", password: "123456" };
    await LoginPage.login(user.email, user.password);

    // Step 8: After successful login, verify the user is on the shipping page.
    await expect(browser).toHaveUrl(expect.stringContaining("/shipping"), { timeout: 5000 });

    // Step 9: Go back to the cart and verify all items are preserved.
    await browser.back(); // Or navigate directly to the cart page
    await expect(await CartPage.getSubtotalQuantity()).toBe(quantity);
    await expect(await CartPage.getProductQuantityByIndex(0)).toEqual(quantity.toString());
  });
});
