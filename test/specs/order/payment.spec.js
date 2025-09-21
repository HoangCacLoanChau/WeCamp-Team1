import { $, browser } from '@wdio/globals';
import { expect as chaiExpect } from 'chai';

import LoginPage from '../../pageobjects/auth/login.page.js';
import ProductPage from '../../pageobjects/product/product.page.js';
import CartPage from '../../pageobjects/product/cart.page.js';
import CheckoutPage from '../../pageobjects/order/shipping.page.js';
import PaypalPage from '../../pageobjects/order/paypal.page.js';
import OrderPage from '../../pageobjects/order/order.page.js';

describe('Payment Process Flow', () => {
  beforeEach(async () => {
    await LoginPage.open();
    await LoginPage.login('capstone.test@gmail.com', '1');

    await ProductPage.openHomePage();
    await ProductPage.open('68b01c61ef175adb20697910');
    await ProductPage.addToCart();

    await CartPage.openCart();
    await CartPage.checkOutBtn.waitForClickable({ timeout: 10000 });
    await CartPage.checkOutBtn.click();

    await CheckoutPage.fillShippingInfo({
      address: '123 Street',
      city: 'HCMC',
      postalCode: '700000',
      country: 'Vietnam'
    });
    await CheckoutPage.btnContinue.click();
    await CheckoutPage.placeOrder();

    await (await OrderPage.header).waitForDisplayed({ timeout: 10000 });
  });

  afterEach(async () => {
    await browser.reloadSession();
  });

  it('Successfully pay with PayPal', async () => {
    const notPaidText = await (await OrderPage.paymentStatus).getText();
    chaiExpect(notPaidText).to.include('Not Paid');

    await OrderPage.clickContinueToPaypal();
    await PaypalPage.login('capstone.test@gmail.com', '12345678');
    await (await PaypalPage.btnCompletePurchase).waitForDisplayed({ timeout: 20000 });
    await PaypalPage.completePurchase();

    await (await OrderPage.paymentStatus).waitForDisplayed({ timeout: 10000 });
    const paidText = await (await OrderPage.paymentStatus).getText();
    chaiExpect(paidText).to.include('Paid');

    const successAlert = await $('//div[contains(text(),"Order is paid")]');
    await successAlert.waitForDisplayed({ timeout: 10000 });
    chaiExpect(await successAlert.isDisplayed()).to.equal(true);
  });

  it('Cancel PayPal and return to app', async () => {
    await OrderPage.clickContinueToPaypal();
    await PaypalPage.cancelAndReturn();

    const paymentStatusText = await (await OrderPage.paymentStatus).getText();
    chaiExpect(paymentStatusText).to.include('Not Paid');
  });

  it('Invalid PayPal login', async () => {
    await OrderPage.clickContinueToPaypal();
    await PaypalPage.login('capstone.test@gmail.com', '123456789');

    const invalidAccErrorMsg = await $('//div[@id="content"]//div//div//p[@role="alert"]');
    chaiExpect(await invalidAccErrorMsg.isDisplayed()).to.equal(true);
  });

  it('Insufficient PayPal balance', async () => {
  const notPaidText = await (await OrderPage.paymentStatus).getText();
  chaiExpect(notPaidText).to.include('Not Paid');

  await OrderPage.clickContinueToPaypal();
  await PaypalPage.login('nobalance.test@gmail.com', '12345678');

  const noBalanceErrorMsg = await $('//div[@role="alert"]');
  chaiExpect(await noBalanceErrorMsg.isDisplayed()).to.equal(true);

  await PaypalPage.cancelAndReturn();

  const stillNotPaidText = await (await OrderPage.paymentStatus).getText();
  chaiExpect(stillNotPaidText).to.include('Not Paid');
});

  it('Network fails during payment', async () => {
  const notPaidText = await (await OrderPage.paymentStatus).getText();
  chaiExpect(notPaidText).to.include('Not Paid');

  await OrderPage.clickContinueToPaypal();
  await PaypalPage.login('capstone.test@gmail.com', '12345678');

  await browser.throttleNetwork('offline');
  await PaypalPage.completePurchase();

  await browser.throttleNetwork('online');

  const stillNotPaidText = await (await OrderPage.paymentStatus).getText();
  chaiExpect(stillNotPaidText).to.include('Not Paid');
});
});