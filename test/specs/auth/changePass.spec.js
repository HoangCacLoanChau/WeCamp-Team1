import { expect } from "@wdio/globals";
import LoginPage from "../../pageobjects/auth/login.page.js";
import HomePage from "../../pageobjects/home.page.js";
import ProfilePage from "../../pageobjects/auth/profile.page.js";

describe("Epic 1 - Change Password", () => {
  const ORIGINAL_PASS = "123456";
  const ALT_PASS = "T!ger#R123";
  let originalProfile;

  before(async () => {
    await browser.maximizeWindow();
    await LoginPage.open();
    await LoginPage.login("acc@gmail.com", ORIGINAL_PASS);
    await HomePage.navigateToProfile();
    // await expect(browser).toHaveUrl("http://localhost:3000/profile");
    // await expect(ProfilePage.nameInput).toBeDisplayed({ timeout: 10000 });
    originalProfile = await ProfilePage.getOriginalProfile();
  });

  beforeEach(async () => {
    if (!(await browser.getUrl()).includes("/profile")) {
      await ProfilePage.open();
      // await expect(ProfilePage.nameInput).toBeDisplayed({ timeout: 10000 });
      // await expect(ProfilePage.emailInput).toBeDisplayed({ timeout: 10000 });
    }
  });

  after(async () => {
    // đảm bảo về password gốc sau toàn bộ suite
    await ProfilePage.updateProfile({ password: ORIGINAL_PASS, confirmPassword: ORIGINAL_PASS });
    await expect(ProfilePage.toastMessage).toBeDisplayed({ timeout: 10000 });
    await expect(ProfilePage.toastMessage).toHaveText("Profile updated successfully");

    // trả lại name/email nếu có chỉnh
    //   await ProfilePage.updateProfile(originalProfile);
    // (đợi một nhịp rồi kết thúc)
    // await browser.pause(300);
    await browser.reloadSession();
  });

  it("TCCP_01: should change password successfully with valid format", async () => {
    // Đổi sang ALT_PASS
    await ProfilePage.updateProfile({ password: ALT_PASS, confirmPassword: ALT_PASS });
    await expect(ProfilePage.toastMessage).toBeDisplayed({ timeout: 10000 });
    expect(ProfilePage.toastMessage).toHaveText("Profile updated successfully");
  });

  // invalid passwords format
  const invalidSamples = [
    { pw: "1234Abcd!", note: "Sequential characters (1234)" },
    { pw: "Aaaa@1111", note: "Repeated characters (Aaaa / 1111)" },
    { pw: "password", note: "Common password" },
    { pw: "12345678", note: "Common numeric password" },
    { pw: "iloveyou", note: "Common phrase password" },
    { pw: "Secure@Nhi", note: "Contains personal info (name/email)" },
    { pw: "SECURE@123", note: "Missing lowercase" },
    { pw: "SecurePass", note: "Missing number & special char" },
    { pw: "S@1a", note: "Too short (< 8 chars)" },
  ];

  invalidSamples.forEach(({ pw, note }, i) => {
    it(`TCCP_02.${
      i + 1
    }: should block when new password has invalid format - ${note}`, async () => {
      await ProfilePage.updateProfile({ password: pw, confirmPassword: pw });

      await browser.pause(800); // Give time for toast to appear // Assert that the success toast is NOT displayed

      if (await ProfilePage.toastMessage.isExisting()) {
        const text = await ProfilePage.toastMessage.getText();
        expect(text).not.toHaveText("Profile updated successfully", {
          message: `TCCP_02.${
            i + 1
          }: Expected update to fail for invalid password '${pw}', but it succeeded.`,
        });
      } // Assert that the failure toast IS displayed

      await expect(ProfilePage.toastMessageFail).toBeDisplayed({
        timeout: 5000,
        message: `TCCP_02.${
          i + 1
        }: Expected failure toast to be displayed for invalid password '${pw}', but it was not.`,
      }); // Verify that the URL remains on the profile page

      expect(await browser.getUrl()).toContain("/profile");
    });
  });

  it("TCCP_03: should block when new password and confirmation do not match", async () => {
    await ProfilePage.updateProfile({ password: "Strong@1234", confirmPassword: "Strong@123!" });
    await expect(ProfilePage.toastMessageFail).toBeDisplayed({ timeout: 5000 });
    expect(ProfilePage.toastMessageFail).toHaveText("Passwords do not match");
  });
  it("TCCP_04: Verify user is unable to change password if new password matches a previously used password (original password)", async function () {
    await ProfilePage.updateProfile({ password: ALT_PASS, confirmPassword: ALT_PASS });
    await expect(ProfilePage.toastMessage).toBeDisplayed({ timeout: 10000 });
    await ProfilePage.updateProfile({ password: ORIGINAL_PASS, confirmPassword: ORIGINAL_PASS });
    await browser.pause(800);
    await expect(ProfilePage.toastMessage).toBeDisplayed({ timeout: 5000 });
    await expect(ProfilePage.toastMessage).toHaveText(expect.stringContaining("previously used"));
    expect(await browser.getUrl()).toContain("/profile");
  });
});
