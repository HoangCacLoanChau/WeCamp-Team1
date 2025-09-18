import LoginPage from '../../pageobjects/auth/login.page';

describe('Login functionality', () => {
  beforeEach(async () => {
    await LoginPage.open();
  });
  afterEach(async () => {
    await browser.reloadSession();
  });
  it('TCSI_01 - Successful login with a valid email and password and navigated to Home page', async () => {
    await LoginPage.login('user@gmail.com', 'Password@123');
    await expect(browser).toHaveUrl('http://localhost:3000/');
  });
  it('TCSI_02 - Successful login with an email containing subdomain and navigated to Home page ', async () => {
    await LoginPage.login('wecamp@example.com.vn', 'Subdomain@123');
    await expect(browser).toHaveUrl('http://localhost:3000/');
  });
  it('TCSI_03 - Successful login with an email containing numbers and navigated to Home page ', async () => {
    await LoginPage.login('wecamp8@123gmail.com', 'Number@123');
    await expect(browser).toHaveUrl('http://localhost:3000/');
  });
  it('TCSI_04 - Login fails with an incorrect email and show error message ', async () => {
    await LoginPage.login('invaliduser@gmail.com', 'Password@123');
    await expect(LoginPage.toast).toHaveText('Invalid email or password');
  });
  it('TCSI_05 - Login fails with an incorrect password and show error message ', async () => {
    await LoginPage.login('user@gmail.com', 'Pass@123');
    await expect(LoginPage.toast).toHaveText('Invalid email or password');
  });
  it('TCSI_06 - Verify that the password is case-sensitive and show error message ', async () => {
    await LoginPage.login('user@gmail.com', 'password@123');
    await expect(LoginPage.toast).toHaveText('Invalid email or password');
  });
  it('TCSI_07 - Login fails with an email unregistered and show error message ', async () => {
    await LoginPage.login('nouser@gmail.com', 'Password@123');
    await expect(LoginPage.toast).toHaveText('Invalid email or password');
  });
  it('TCSI_08 - Login fails with empty email field and show error message ', async () => {
    await LoginPage.login('', 'Password@123');
    await expect(LoginPage.toast).toHaveText('Invalid email or password');
  });
  it('TCSI_09 - Login fails with empty password field and show error message ', async () => {
    await LoginPage.login('user@gmail.com', '');
    await expect(LoginPage.toast).toHaveText('Invalid email or password');
  });
  it('TCSI_10 - Login fails with empty email and password fields and show error message ', async () => {
    await LoginPage.login('', '');
    await expect(LoginPage.toast).toHaveText('Invalid email or password');
  });
});
