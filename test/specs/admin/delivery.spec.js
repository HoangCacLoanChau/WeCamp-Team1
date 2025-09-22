import LoginPage from "../../pageobjects/auth/login.page.js";
import AdminOrderPage from "../../pageobjects/admin/admin-order.page.js";
import OrderPage from "../../pageobjects/order/order.page";
import { $, browser } from "@wdio/globals";
import { expect as chaiExpect } from "chai";
import PaypalPage from "../../pageobjects/order/paypal.page.js";
import HomePage from "../../pageobjects/home.page.js";
import ProductPage from "../../pageobjects/product/product.page.js";
import CartPage from "../../pageobjects/product/cart.page.js";
import ShippingPage from "../../pageobjects/order/shipping.page.js";
import PaymentPage from "../../pageobjects/order/payment.page.js";
import PlaceOrderPage from "../../pageobjects/order/placeOrder.page.js";

describe("Mark as Delivered Flow", () => {
  let orderPaidId;

  before(async () => {
    // 1. Log in as a regular user and place a new, paid order.
    await LoginPage.open();
    await LoginPage.login("john@email.com", "123456");

    await HomePage.waitForProductListToLoad();
    await HomePage.openProductbyIndex(0);
    await ProductPage.setProductQuantity(1);
    await ProductPage.clickAddToCartButton();

    await CartPage.open();
    await CartPage.clickCheckout();
    await ShippingPage.fillShippingDetails("123 Test St", "Test City", "12345", "Test Country");
    await ShippingPage.continueButton.click();
    await PaymentPage.clickContinue();
    await PlaceOrderPage.clickPlaceOrderButton();
    const notPaidText = await (await OrderPage.paymentStatus).getText();
    chaiExpect(notPaidText).to.include("Not Paid");

    await OrderPage.clickContinueToPaypal();
    await PaypalPage.login("chau@123.com", "12345678");
    await (await PaypalPage.btnCompletePurchase).waitForDisplayed({ timeout: 20000 });
    await PaypalPage.completePurchase();
    const paidText = await (await OrderPage.paymentStatus).getText();
    chaiExpect(paidText).to.include("Paid");

    const successAlert = await $('//div[contains(text(),"Order is paid")]');
    await successAlert.waitForDisplayed({ timeout: 10000 });
    chaiExpect(await successAlert.isDisplayed()).to.equal(true);
    // Get the dynamic order ID from the URL after placing the order.
    const url = await browser.getUrl();
    orderPaidId = url.split("/").pop();
  });
  afterEach(async () => {
    await browser.reloadSession();
  });
  it('Customer cannot see "Mark As Delivered"', async () => {
    await AdminOrderPage.openOrder(orderPaidId);
    await expect(AdminOrderPage.btnMarkDelivered).not.toBeDisplayed();
  });
  it("TCMAD_01: Verify admin has access validation for Order Details page and Mark delivered", async () => {
    await LoginPage.open();
    await LoginPage.login("admin@email.com", "123456");
    await browser.pause(800);
    await AdminOrderPage.openOrder(orderPaidId);
    await expect(AdminOrderPage.btnMarkDelivered).toBeDisplayed();
    await AdminOrderPage.openOrder(orderPaidId);
    await AdminOrderPage.markDelivered();
    await expect(await AdminOrderPage.deliveryStatus.getText()).toContain("Delivered");
  });

  // it("Double click still 1 timestamp", async () => {
  //   await LoginPage.login("admin@email.com", "123456");
  //   await browser.pause(800);
  //   await AdminOrderPage.openOrder(orderPaidId);
  //   await AdminOrderPage.btnMarkDelivered.doubleClick();

  //   const statusText = await AdminOrderPage.deliveryStatus.getText();
  //   expect(statusText.match(/Delivered/g).length).toBe(1);
  // });
});
describe("Admin Cannot mark order not paid", () => {
  let orderNotPaidId;
  it("Cannot mark delivered when not paid", async () => {
    // 1. Log in as a regular user and place a new, paid order.
    await LoginPage.open();
    await LoginPage.login("john@email.com", "123456");

    await HomePage.waitForProductListToLoad();
    await HomePage.openProductbyIndex(0);
    await ProductPage.setProductQuantity(1);
    await ProductPage.clickAddToCartButton();

    await CartPage.open();
    await CartPage.clickCheckout();
    await ShippingPage.fillShippingDetails("123 Test St", "Test City", "12345", "Test Country");
    await ShippingPage.continueButton.click();
    await PaymentPage.clickContinue();
    await PlaceOrderPage.clickPlaceOrderButton();
    const notPaidText = await (await OrderPage.paymentStatus).getText();
    chaiExpect(notPaidText).to.include("Not Paid");
    const url = await browser.getUrl();
    orderNotPaidId = url.split("/").pop();
    await AdminOrderPage.openOrder(orderNotPaidId);
    await expect(AdminOrderPage.btnMarkDelivered).not.toBeDisplayed();
  });
});
