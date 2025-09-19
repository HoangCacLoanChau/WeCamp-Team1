import LoginPage from "../../pageobjects/auth/login.page";
import ProfilePage from "../../pageobjects/auth/profile.page";
import HomePage from "../../pageobjects/home.page";

describe("Login and Profile navigation", () => {
  afterEach(async () => {
    await browser.reloadSession();
  });

  it("should navigate to Profile page from header menu", async () => {
    // Step 1: Login
    await LoginPage.open();
    await LoginPage.login("admin@email.com", "123456");
    await expect(browser).toHaveUrl("http://localhost:3000/");

    // Step 2: Navigate to Profile via header dropdown
    await HomePage.navigateToProfile();

    // Step 3: Verify successful navigation to Profile page
    await expect(browser).toHaveUrl("http://localhost:3000/profile");
    await expect(ProfilePage.nameInput).toBeDisplayed();
    await expect(ProfilePage.emailInput).toBeDisplayed();
  });

  it("should display profile information (Name, Email) and empty Password fields", async () => {
    await LoginPage.open();
    await LoginPage.login("admin@email.com", "123456");
    await expect(browser).toHaveUrl("http://localhost:3000/");
    await HomePage.navigateToProfile();
    await expect(browser).toHaveUrl("http://localhost:3000/profile");

    // Expected: Fields are visible
    await expect(ProfilePage.nameInput).toBeDisplayed();
    await expect(ProfilePage.emailInput).toBeDisplayed();
    await expect(ProfilePage.passwordInput).toBeDisplayed();
    await expect(ProfilePage.confirmPasswordInput).toBeDisplayed();

    // Expected: Name & Email có giá trị (không rỗng)
    await expect(ProfilePage.nameInput).not.toHaveValue("");
    await expect(ProfilePage.emailInput).not.toHaveValue("");

    // Expected: Password & Confirm Password trống và là input type="password"
    await expect(ProfilePage.passwordInput).toHaveValue("");
    await expect(ProfilePage.confirmPasswordInput).toHaveValue("");
    await expect(ProfilePage.passwordInput).toHaveAttribute("type", "password");
    await expect(ProfilePage.confirmPasswordInput).toHaveAttribute("type", "password");
  });
});
