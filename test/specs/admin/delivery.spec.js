import LoginPage from '../pageobjects/auth/login.page.js';
import AdminOrderPage from '../pageobjects/admin/admin-order.page.js';

describe('Mark as Delivered Flow', () => {
  it('Admin sees "Mark As Delivered"', async () => {
    await LoginPage.open();
    await LoginPage.login('admin@email.com', '123456');
    await AdminOrderPage.openOrder('68c25134e3d1cf00f6370055');
    await expect(AdminOrderPage.btnMarkDelivered).toBeDisplayed();
  });

  it('Customer cannot see "Mark As Delivered"', async () => {
    await LoginPage.open();
    await LoginPage.login('capstone.test@gmail.com', '1');
    await AdminOrderPage.openOrder('68c25134e3d1cf00f6370055');
    await expect(AdminOrderPage.btnMarkDelivered).not.toBeDisplayed();
  });

  it('Admin marks order delivered', async () => {
    await LoginPage.open();
    await LoginPage.login('admin@email.com', '123456');
    await AdminOrderPage.openOrder('68c25134e3d1cf00f6370055');
    await AdminOrderPage.markDelivered();
    await expect(AdminOrderPage.deliveryStatus).toHaveTextContaining('Delivered');
  });

  it('Double click still 1 timestamp', async () => {
    await LoginPage.open();
    await LoginPage.login('admin@email.com', '123456');
    await AdminOrderPage.openOrder('68c25134e3d1cf00f6370055');
    await AdminOrderPage.btnMarkDelivered.doubleClick();

    const statusText = await AdminOrderPage.deliveryStatus.getText();
    expect(statusText.match(/Delivered/g).length).toBe(1);
  });

  it('Cannot mark delivered when not paid', async () => {
    await LoginPage.open();
    await LoginPage.login('admin@email.com', '123456');
    await AdminOrderPage.openOrder('68cb8fa66c6ac7735dfc1aeb');
    await expect(AdminOrderPage.btnMarkDelivered).not.toBeDisplayed();
    await expect(AdminOrderPage.deliveryStatus).toHaveTextContaining('Not Delivered');
  });
});