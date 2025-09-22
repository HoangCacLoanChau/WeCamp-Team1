import HomePage from "../pageobjects/home.page";
import ProductPage from "../pageobjects/product/product.page";
import LoginPage from "../pageobjects/auth/login.page";
import CartPage from "../pageobjects/product/cart.page";
import ShippingPage from "../pageobjects/order/shipping.page";
import PaymentPage from "../pageobjects/order/payment.page";
import OrderPage from "../pageobjects/order/order.page";
import PlaceOrderPage from "../pageobjects/order/placeOrder.page";
import { $, browser } from "@wdio/globals";
import { expect as chaiExpect } from "chai";
import PaypalPage from "../pageobjects/order/paypal.page.js";
import AdminOrderPage from "../pageobjects/admin/admin-order.page.js";
describe("Run main flow ", () => {
  let orderPaidId;
  before(async () => {
    await browser.maximizeWindow();
  });
  it("placeOrder", async () => {
    // 1. Log in with a valid user.
    await LoginPage.open();
    await LoginPage.login("john@email.com", "123456");

    // 2. Add a single product to the cart.
    const products = [
      { index: 0, quantity: 1 },
      { index: 1, quantity: 1 },
    ];
    const shippingData = {
      address: "123 Main St",
      city: "Ho Chi Minh City",
      postalCode: "70000",
      country: "Vietnam",
    };
    const expectedOrderItems = [];
    await HomePage.waitForProductListToLoad();

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
      await HomePage.open();
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
    const url = await browser.getUrl();
    orderPaidId = url.split("/").pop();
  });
  it("paypal", async () => {
    const notPaidText = await (await OrderPage.paymentStatus).getText();
    chaiExpect(notPaidText).to.include("Not Paid");

    await OrderPage.clickContinueToPaypal();
    await PaypalPage.login("chau@123.com", "12345678");
    await (await PaypalPage.btnCompletePurchase).waitForDisplayed({ timeout: 20000 });
    await PaypalPage.completePurchase();

    // await (await OrderPage.paymentStatus).waitForDisplayed({ timeout: 10000 });
    const paidText = await (await OrderPage.paymentStatus).getText();
    chaiExpect(paidText).to.include("Paid");

    const successAlert = await $('//div[contains(text(),"Order is paid")]');
    await successAlert.waitForDisplayed({ timeout: 10000 });
    chaiExpect(await successAlert.isDisplayed()).to.equal(true);
  });

  it("Admin mark delivery", async () => {
    await browser.execute(() => localStorage.clear());
    await LoginPage.open();
    await LoginPage.login("admin@email.com", "123456");
    await browser.pause(800);
    await AdminOrderPage.openOrder(orderPaidId);
    await expect(AdminOrderPage.btnMarkDelivered).toBeDisplayed();
    await AdminOrderPage.openOrder(orderPaidId);
    await AdminOrderPage.markDelivered();
    await expect(await AdminOrderPage.deliveryStatus.getText()).toContain("Delivered");
    await browser.pause(5000);
  });
});
