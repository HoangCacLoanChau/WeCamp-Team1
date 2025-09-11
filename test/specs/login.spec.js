// specs/login.spec.js
import LoginPage from "../pageobjects/login.page";
describe("Login functionality", () => {
  it("should login with valid credentials", async () => {
    await LoginPage.open();
    await LoginPage.login("admin@email.com", "123");
    await expect(browser).toHaveUrl("http://localhost:3000/");
  });
});
