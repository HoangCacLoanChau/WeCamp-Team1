import LoginPage from "../../pageobjects/auth/login.page";

describe("Login functionality", () => {
  beforeEach(async () => {
    await LoginPage.open();
  });
  afterEach(async () => {
    await browser.reloadSession();
  });
  it("should login with valid credentials", async () => {
    await LoginPage.login("admin@email.com", "123456");
    await expect(browser).toHaveUrl("http://localhost:3000/");
  });
  it("should show error for invalid credentials", async () => {
    await LoginPage.login("wrong@email.com", "wrongpass");
    // Check error message is displayed
    await expect(LoginPage.toast).toHaveText("Invalid email or password");
  });
});
