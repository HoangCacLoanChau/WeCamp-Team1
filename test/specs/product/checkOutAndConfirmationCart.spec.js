import HomePage from "../../pageobjects/home.page";
import ProductPage from "../../pageobjects/product/product.page";
import LoginPage from "../../pageobjects/auth/login.page";
import CartPage from "../../pageobjects/product/cart.page";
import ShippingPage from "../../pageobjects/order/shipping.page";
import PaymentPage from "../../pageobjects/order/payment.page";
import PlaceOrderPage from "../../pageobjects/order/placeOrder.page";
describe("Cart checkout and confirmation", () => {
  before(async () => {
    await browser.maximizeWindow();
  });
  afterEach(async () => {
    await browser.execute(() => localStorage.clear());
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

  it("TCPO_11: Verify checkout continues when shipping form is fully filled with multiple products", async () => {
    //  Log in with a valid user.
    await LoginPage.open();
    await LoginPage.login("john@email.com", "123456");

    //  products
    const products = [
      { index: 0, quantity: 2 },
      { index: 1, quantity: 1 },
      { index: 2, quantity: 3 },
    ];
    const shippingData = {
      address: "11",
      city: "HCM",
      postalCode: "70000",
      country: "VietNam",
    };
    const expectedOrderItems = [];

    // Loop through products, add them to the cart, and collect details

    for (const product of products) {
      await HomePage.open();
      await HomePage.waitForProductListToLoad();
      await HomePage.openProductbyIndex(product.index);
      await ProductPage.setProductQuantity(product.quantity);

      // Get the product name dynamically and store it
      const productDetails = await ProductPage.getProductDetails();
      expectedOrderItems.push({
        name: productDetails.name,
        quantity: product.quantity,
        price: productDetails.price,
      });

      await ProductPage.clickAddToCartButton();
      // Go back to the homepage to select the next product
      await browser.back();
      await HomePage.waitForProductListToLoad();
    }

    // 4. In cart page, get totals to compare on the Place Order page.
    await CartPage.open();
    const expectedCartTotalPrice = await CartPage.getSubtotalPrice();

    // 5. Navigate to the shipping page to start checkout.
    await CartPage.clickCheckout();
    await expect(browser).toHaveUrl(expect.stringContaining("/shipping"));

    // shipping form and continue.

    await ShippingPage.fillShippingDetails(
      shippingData.address,
      shippingData.city,
      shippingData.postalCode,
      shippingData.country,
    );
    await ShippingPage.continueButton.click();

    // 7. Assert that the browser navigates to the payment page and PayPal is selected.
    await expect(browser).toHaveUrl(expect.stringContaining("/payment"), { timeout: 5000 });
    // 8. Go to the place order page.
    await PaymentPage.clickContinue();
    await expect(browser).toHaveUrl(expect.stringContaining("/placeorder"), { timeout: 5000 });

    // 9. Verify the order details on the "Place Order" page.
    // Verify shipping address and payment method.
    const fullAddress = `${shippingData.address}, ${shippingData.city} ${shippingData.postalCode}, ${shippingData.country}`;
    await expect(await PlaceOrderPage.getShippingAddress()).toEqual(fullAddress);

    //. Verify that each item's name and quantity are correct by looping through the expected items
    for (let i = 0; i < expectedOrderItems.length; i++) {
      const actualItemName = await PlaceOrderPage.getOrderItemNameByIndex(i);
      const actualItemQuantity = await PlaceOrderPage.getOrderItemQtyByIndex(i);
      const actualItemPrice = await PlaceOrderPage.getOrderItemPriceByIndex(i);
      await expect(actualItemName).toEqual(expectedOrderItems[i].name);
      await expect(actualItemQuantity).toBe(expectedOrderItems[i].quantity);
      await expect(`$${actualItemPrice}`).toEqual(expectedOrderItems[i].price);
    }
    // card right
    const actualOrderTotalPrice = await PlaceOrderPage.getTotalPrice();
    const tax = await PlaceOrderPage.getTaxPrice();
    const shipping = await PlaceOrderPage.getShippingPrice();
    await expect(actualOrderTotalPrice).toBeCloseTo(expectedCartTotalPrice + tax + shipping);
  });
  it("TCPO_12: Verify checkout continues when one or more shipping fields are empty", async () => {
    // 1. Log in with a valid user.
    await LoginPage.open();
    await LoginPage.login("john@email.com", "123456");
    // 2. Add a product to the cart.
    await HomePage.waitForProductListToLoad();
    await HomePage.openProductbyIndex(0);
    await ProductPage.setProductQuantity(1);
    await ProductPage.clickAddToCartButton();

    // 3. Navigate to the shipping page to start checkout.
    await CartPage.open();
    await CartPage.clickCheckout();
    await expect(browser).toHaveUrl(expect.stringContaining("/shipping"));

    // 4. Leave all fields empty and click "Continue".
    const emptyShippingData = {
      address: "",
      city: "",
      postalCode: "",
      country: "",
    };
    await ShippingPage.fillShippingDetails(
      emptyShippingData.address,
      emptyShippingData.city,
      emptyShippingData.postalCode,
      emptyShippingData.country,
    );
    await ShippingPage.continueButton.click();

    // 5. Assert that the URL does not change, as the form submission is blocked.
    await expect(browser).toHaveUrl(expect.stringContaining("/shipping"));
  });
});
