import HomePage from "../../pageobjects/home.page";
import ProductPage from "../../pageobjects/product/product.page";
import LoginPage from "../../pageobjects/auth/login.page";
import CartPage from "../../pageobjects/product/cart.page";
import ShippingPage from "../../pageobjects/order/shipping.page";
import PaymentPage from "../../pageobjects/order/payment.page";
import OrderPage from "../../pageobjects/order/order.page";
import PlaceOrderPage from "../../pageobjects/order/placeOrder.page";

describe("Place an order", () => {
  before(async () => {
    // Maximize the browser window for consistent test results.
    await browser.maximizeWindow();
  });

  it("TCPO_13: Verify user can successfully place an order", async () => {
    // 1. Log in with a valid user.
    await LoginPage.open();
    await LoginPage.login("john@email.com", "123456");
    await HomePage.waitForProductListToLoad();

    // 2. Add a single product to the cart.
    const products = [{ index: 0, quantity: 1 }];
    const shippingData = {
      address: "123 Main St",
      city: "Ho Chi Minh City",
      postalCode: "70000",
      country: "Vietnam",
    };
    const expectedOrderItems = [];

    for (const product of products) {
      await HomePage.openProductbyIndex(product.index);
      await ProductPage.setProductQuantity(product.quantity);
      const productDetails = await ProductPage.getProductDetails();
      expectedOrderItems.push({
        name: productDetails.name,
        quantity: product.quantity,
        price: productDetails.price,
      });
      await ProductPage.clickAddToCartButton();
      await browser.back();
      await HomePage.waitForProductListToLoad();
    }

    // 3. Navigate to the Cart page and get totals.
    await CartPage.open();
    const expectedCartTotalPrice = await CartPage.getSubtotalPrice();

    // 4. Click "Proceed To Checkout" button.
    await CartPage.clickCheckout();
    await expect(browser).toHaveUrl(expect.stringContaining("/shipping"));

    // 5. Enter valid shipping data and click "Continue".
    await ShippingPage.fillShippingDetails(
      shippingData.address,
      shippingData.city,
      shippingData.postalCode,
      shippingData.country,
    );
    await ShippingPage.continueButton.click();

    // 6. Navigate to Payment page and click "Continue".
    await expect(browser).toHaveUrl(expect.stringContaining("/payment"));
    await PaymentPage.clickContinue();

    // 7. Navigate to Place Order page.
    await expect(browser).toHaveUrl(expect.stringContaining("/placeorder"));

    const tax = await PlaceOrderPage.getTaxPrice();
    const shipping = await PlaceOrderPage.getShippingPrice();

    // 8. Click "Place Order" button.
    await PlaceOrderPage.clickPlaceOrderButton();

    // Assertions after placing the order.
    // 9. Verify the browser navigates to the final order page.
    await expect(browser).toHaveUrl(expect.stringContaining("/order/"));

    // Verify the order details on the final order page.
    // Verify shipping address and payment method.
    const fullAddress = `${shippingData.address}, ${shippingData.city} ${shippingData.postalCode}, ${shippingData.country}`;
    await expect(await OrderPage.getShippingAddress()).toEqual(fullAddress);

    // Verify order items.
    for (let i = 0; i < expectedOrderItems.length; i++) {
      const actualItemName = await OrderPage.getOrderItemNameByIndex(i);
      const actualItemQuantity = await OrderPage.getOrderItemQtyByIndex(i);
      const actualItemPrice = await OrderPage.getOrderItemPriceByIndex(i);
      await expect(actualItemName).toEqual(expectedOrderItems[i].name);
      await expect(actualItemQuantity).toBe(expectedOrderItems[i].quantity);
      await expect(`$${actualItemPrice}`).toEqual(expectedOrderItems[i].price);
    }

    // Verify order summary totals.
    const actualOrderTotalPrice = await OrderPage.getTotalPrice();
    await expect(actualOrderTotalPrice).toBeCloseTo(expectedCartTotalPrice + tax + shipping, 2);

    // Verify the cart is now empty.
    await CartPage.open();
    await expect(await CartPage.getSubtotalQuantity()).toBe(0);
  });

  it("TCPO_14: Verify that ordering the maximum available stock updates the product to 'Out of Stock'", async () => {
    await HomePage.open();
    await HomePage.waitForProductListToLoad();

    //  Click on a product to view its details.
    // We will use the first product on the page for this test.
    const productIndex = 0;
    await HomePage.openProductbyIndex(productIndex);

    //  Get the maximum available quantity.
    const maxQuantity = await ProductPage.getMaxProductStock();
    if (maxQuantity === 0) {
      throw new Error("Cannot run this test: The selected product is already out of stock.");
    }

    // Select the maximum available quantity and add it to the cart.
    await ProductPage.setProductQuantity(maxQuantity);
    await ProductPage.clickAddToCartButton();

    //  Navigate to the Cart page and get totals.
    await CartPage.open();
    await CartPage.clickCheckout();
    await expect(browser).toHaveUrl(expect.stringContaining("/shipping"));

    // Fill out the shipping form and proceed to payment.
    const shippingData = {
      address: "123 Test St",
      city: "Test City",
      postalCode: "12345",
      country: "Test Country",
    };
    await ShippingPage.fillShippingDetails(
      shippingData.address,
      shippingData.city,
      shippingData.postalCode,
      shippingData.country,
    );
    await ShippingPage.continueButton.click();
    await expect(browser).toHaveUrl(expect.stringContaining("/payment"));
    await PaymentPage.clickContinue();
    await expect(browser).toHaveUrl(expect.stringContaining("/placeorder"));

    // Place the order.
    await PlaceOrderPage.clickPlaceOrderButton();
    await expect(browser).toHaveUrl(expect.stringContaining("/order/"));

    //  Navigate back to the product's home page.
    await HomePage.open();
    await HomePage.waitForProductListToLoad();

    // Click on the same product to verify its new stock status.
    await HomePage.openProductbyIndex(productIndex);

    // Assertions: Verify that the product is now "Out of Stock" and the button is disabled.
    await expect(await ProductPage.isProductInStock()).toBe(false);
    await expect(await ProductPage.isAddToCartButtonEnabled()).toBe(false);
  });
});
