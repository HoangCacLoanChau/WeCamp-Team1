import LoginPage from '../pageobjects/auth/login.page.js';
import ProductPage from '../pageobjects/product/home.page.product.js';
import CartPage from '../pageobjects/order/cart.page.js';
import CheckoutPage from '../pageobjects/order/shipping.page.js';
import PaypalPage from '../pageobjects/order/paypal.page.js';
import OrderPage from '../pageobjects/order/order.page.js';

describe('Payment Process Flow', () => {
  before(async () => {
    await LoginPage.open();
    await LoginPage.login('capstone.test@gmail.com', '1');
  });

  it('Navigate to Purchase page', async () => {
    await ProductPage.open();
    await ProductPage.addToCart('Airpods Wireless Bluetooth Headphones');
    await CartPage.goToCheckout();
    await CheckoutPage.fillShippingInfo({
      address: '123 Street',
      city: 'HCMC',
      postal: '700000',
      country: 'Vietnam'
    });
    await CheckoutPage.selectPayment('PayPal');
    await CheckoutPage.placeOrder();
    await expect(OrderPage.header).toBeDisplayed();
    await expect(OrderPage.paymentStatus).toHaveTextContaining('Not Paid');
  });

  it('Redirects to PayPal sign-in page', async () => {
    await OrderPage.clickContinueToPaypal();
    await PaypalPage.switchToPaypal();
    await expect(browser).toHaveUrlContaining('sandbox.paypal.com');
  });

  it('Cancel PayPal and return to app', async () => {
    await OrderPage.clickContinueToPaypal();
    await PaypalPage.cancelAndReturn();
    await expect(OrderPage.paymentStatus).toHaveTextContaining('Not Paid');
  });

  it('Valid PayPal login', async () => {
    await OrderPage.clickContinueToPaypal();
    await PaypalPage.login('capstone.test@gmail.com', '12345678');
    await expect(PaypalPage.btnCompletePurchase).toBeDisplayed();
  });

  it('Invalid PayPal login', async () => {
    await OrderPage.clickContinueToPaypal();
    await PaypalPage.login('capstone.test@gmail.com', '123456789');

    const errorMsg = await $('div=Some of your info isn\'t correct');
    await expect(errorMsg).toBeDisplayed();
  });

  it.skip('Insufficient PayPal balance', async () => {
    // mock sandbox: assert paymentStatus "Not Paid"
  });

  it.skip('Network fail during payment', async () => {
    // mock sandbox: assert paymentStatus "Not Paid"
  });

  it('PayPal payment success', async () => {
    await OrderPage.clickContinueToPaypal();
    await PaypalPage.login('capstone.test@gmail.com', '12345678');
    await PaypalPage.completePurchase();
    await expect(OrderPage.paymentStatus).toHaveTextContaining('Paid');
    await expect($('.alert-success')).toBeDisplayed();
  });
});