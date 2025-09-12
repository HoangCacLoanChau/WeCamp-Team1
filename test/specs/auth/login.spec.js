import LoginPage from "../../pageobjects/auth/login.page";

// specs/login.spec.js
describe("Login functionality", () => {
  it("should login with valid credentials", async () => {
    await LoginPage.open();
    await LoginPage.login("admin@email.com", "123");
    await expect(browser).toHaveUrl("http://localhost:3000/");
  });
});
