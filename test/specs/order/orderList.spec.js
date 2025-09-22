import LoginPage from "../../pageobjects/auth/login.page.js";
import HomePage from "../../pageobjects/home.page.js";
import ProfilePage from "../../pageobjects/auth/profile.page.js";
import ProductPage from "../../pageobjects/product/product.page.js";
import CartPage from "../../pageobjects/product/cart.page.js";
import ShippingPage from "../../pageobjects/order/shipping.page.js";
import PaymentPage from "../../pageobjects/order/payment.page.js";
import PlaceOrderPage from "../../pageobjects/order/placeOrder.page.js";
import OrderPage from "../../pageobjects/order/order.page.js";
import PaypalPage from "../../pageobjects/order/paypal.page.js";
import { expect as chaiExpect } from "chai";
import { $, browser } from "@wdio/globals";

describe("User Order History Verification", () => {
  let orderId;

  // This hook runs once before all tests
  before(async () => {
    // Log in as a regular user and place an initial order.
    // This order will be used for subsequent tests.
    await browser.maximizeWindow();
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
    await PlaceOrderPage.placeOrderButton.waitForDisplayed({ timeout: 10000 });
    await PlaceOrderPage.clickPlaceOrderButton();
    await OrderPage.btnPaypal.waitForClickable({ timeout: 20000 });

    // Get the dynamic order ID from the URL after placing the order.
    const url = await browser.getUrl();
    orderId = url.split("/").pop();
  });

  // This test covers TCVOH_01 and TCVOH_04.
  it("should verify a newly placed order is unpaid and not delivered", async () => {
    // Navigate to the profile page to verify the initial status.
    console.log(`orderId at tes 1: ${orderId}`);

    await ProfilePage.open();
    await ProfilePage.orderHistoryTable.waitForDisplayed({ timeout: 10000 });

    // Verify the new order appears and has the correct initial status.
    const initialPaidStatus = await ProfilePage.getPaidStatus(orderId);
    const initialDeliveredStatus = await ProfilePage.getDeliveredStatus(orderId);
    await chaiExpect(initialPaidStatus).to.equal("Not Paid");
    await chaiExpect(initialDeliveredStatus).to.equal("Not Delivered");
  });

  //This test covers TCVOH_03 and TCVOH_10.
  it("should verify a paid order is still not delivered on the profile and order page", async () => {
    // Navigate back to the order page to pay for the order.
    await OrderPage.open(orderId);
    await OrderPage.btnPaypal.waitForClickable({ timeout: 20000 });
    await OrderPage.clickContinueToPaypal();
    await PaypalPage.login("chau@123.com", "12345678");
    await PaypalPage.btnCompletePurchase.waitForDisplayed({ timeout: 30000 });
    await PaypalPage.completePurchase();
    const paidText = await (await OrderPage.paymentStatus).getText();
    chaiExpect(paidText).to.include("Paid");
    const successAlert = await $('//div[contains(text(),"Order is paid")]');
    await successAlert.waitForDisplayed({ timeout: 35000 });
    chaiExpect(await successAlert.isDisplayed()).to.equal(true);
    // Navigate back to the profile page and re-verify the status.
    await ProfilePage.open();
    await ProfilePage.orderHistoryTable.waitForDisplayed({ timeout: 30000 });
    const finalPaidStatus = await ProfilePage.getPaidStatus(orderId);
    const finalDeliveredStatus = await ProfilePage.getDeliveredStatus(orderId);
    await chaiExpect(finalPaidStatus).to.equal("Paid");
    await chaiExpect(finalDeliveredStatus).to.equal("Not Delivered");

    // Click "Details" and verify the updated status on the order page.
    await ProfilePage.clickDetailsButton(orderId);
    const detailsFinalPaidStatus = await OrderPage.paymentStatus;
    await detailsFinalPaidStatus.waitForDisplayed({ timeout: 10000 });
    await chaiExpect(await detailsFinalPaidStatus.getText()).to.include("Paid");
  });

  // This test covers TCVOH_05.
  it("should show an empty order list for a user with no orders", async () => {
    await HomePage.logOut();
    await LoginPage.open();
    await LoginPage.login("noorder@email.com", "123456");
    await HomePage.waitForProductListToLoad();
    await ProfilePage.open();
    // Wait for the table headers to be present before asserting on the rows.
    await ProfilePage.orderHistoryTable.$$("thead th")[0].waitForDisplayed({ timeout: 10000 });

    // Verify the rows are empty.
    const rows = await ProfilePage.orderListRows;
    await chaiExpect(rows.length).to.equal(0);
  });
});
