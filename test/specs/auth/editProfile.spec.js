import { expect } from "@wdio/globals";
import LoginPage from "../../pageobjects/auth/login.page.js";
import HomePage from "../../pageobjects/home.page.js";
import ProfilePage from "../../pageobjects/auth/profile.page.js";

describe("Epic 1 - Edit Profile", () => {
  let originalProfile;

  before(async () => {
    await browser.maximizeWindow();
    await LoginPage.open();
    await LoginPage.login("acc@gmail.com", "123456");
    await expect(browser).toHaveUrl("http://localhost:3000/");
    await HomePage.navigateToProfile();
    await expect(browser).toHaveUrl("http://localhost:3000/profile");
    await expect(ProfilePage.nameInput).toBeDisplayed({ timeout: 10000 });
    originalProfile = await ProfilePage.getOriginalProfile();
  });

  beforeEach(async () => {
    if (!(await browser.getUrl()).includes("/profile")) {
      await ProfilePage.open();
      await expect(ProfilePage.nameInput).toBeDisplayed({ timeout: 10000 });
    }
  });

  after(async () => {
    await ProfilePage.updateProfile(originalProfile);
    try {
      await ProfilePage.toastMessage.waitForExist({ timeout: 10000 });
    } catch (e) {
      /* noop */
    }
    await browser.reloadSession();
  });

  it("TCEP_01: should update profile with valid email", async () => {
    await ProfilePage.updateProfile({ name: "Nhi Phạm", email: "linhnhi@example.com" });
    await ProfilePage.toastMessage.waitForExist({ timeout: 50000 });
    await expect(ProfilePage.toastMessage).toHaveText("Profile updated successfully");
  });

  it("TCEP_02: should block when email missing '@'", async () => {
    await ProfilePage.updateProfile({ name: "Test", email: "editprofilegmailcom" });
    const msg = await ProfilePage.getEmailValidationMessage();
    expect(msg).toContain("Please include an '@'");
  });

  it("TCEP_03: should block when email has more than one '@'", async () => {
    await ProfilePage.updateProfile({ name: "Test", email: "user@@example.com" });
    const msg = await ProfilePage.getEmailValidationMessage();
    expect(msg).toContain("should not contain the symbol '@'");
  });

  it("TCEP_04: should block when '.' is at a wrong position", async () => {
    await ProfilePage.updateProfile({ name: "Test", email: "user@.com" });
    const msg = await ProfilePage.getEmailValidationMessage();
    expect(msg).toContain("'.' is used at a wrong position");
  });

  it('TCEP_05: should block when domain has no "."', async () => {
    await ProfilePage.updateProfile({ name: "Test", email: "user@examplecom" });
    const msg = await ProfilePage.getEmailValidationMessage();
    expect(msg.length).toBeGreaterThan(0);
  });

  it("TCEP_06: should block when email contains space", async () => {
    await ProfilePage.updateProfile({ name: "Test", email: "user@ exam ple.com" });
    const msg = await ProfilePage.getEmailValidationMessage();
    expect(msg).toContain("should not contain the symbol ' '");
  });

  it("TCEP_07: should block when email has disallowed special char", async () => {
    await ProfilePage.updateProfile({ name: "Test", email: "user!tag@example.com" });
    const msg = await ProfilePage.getEmailValidationMessage();
    expect(msg.length).toBeGreaterThan(0);
  });

  it("TCEP_08: should block when email is empty", async () => {
    await ProfilePage.updateProfile({ name: "Test", email: "" });
    const msg = await ProfilePage.getEmailValidationMessage();
    expect(msg.length).toBeGreaterThan(0);
  });
});
