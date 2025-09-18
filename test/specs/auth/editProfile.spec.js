// test/specs/profile/editProfile.e2e.js
import LoginPage from "../../pageobjects/auth/login.page";
import HomePage from "../../pageobjects/auth/home.page";
import ProfilePage from "../../pageobjects/auth/profile.page";

describe("Epic 1 - Edit Profile", () => {
  /** Lưu name/email gốc để reset sau mỗi case */
  let originalProfile;

  beforeEach(async () => {
    // Login và vào trang Profile
    await LoginPage.open();
    await LoginPage.login("editprofile@gmail.com", "150903");
    await expect(browser).toHaveUrl("http://localhost:3000/");
    await HomePage.navigateToProfile();
    await expect(browser).toHaveUrl("http://localhost:3000/profile");

    // Lấy dữ liệu gốc ngay khi vào trang
    originalProfile = await ProfilePage.getOriginalProfile();
  });

  afterEach(async () => {
    try {
      // Reset về name/email ban đầu để không ảnh hưởng case khác
      await ProfilePage.updateProfile({
        name: originalProfile.name,
        email: originalProfile.email,
      });

      await ProfilePage.toast.waitForDisplayed({ timeout: 5000 });
      // Nếu app có icon/khoảng trắng, dùng getText + toContain cho an toàn
      const text = await ProfilePage.toast.getText();
      expect(text).toContain("Profile updated successfully");
    } finally {
      // Làm sạch browser cho test kế tiếp
      await browser.reloadSession();
    }
  });

  it("TCEP_01: should update profile with valid email", async () => {
    const newName = "Nhi Phạm";
    const validEmails = [
      "user@example.com",
      "firstname.lastname@domain.com.au",
      "usertag@do-main.com",
      "user_tag@domain.com",
    ];

    for (const email of validEmails) {
      await ProfilePage.updateProfile({ name: newName, email });

      await ProfilePage.toast.waitForDisplayed({ timeout: 5000 });
      const text = await ProfilePage.toast.getText();
      expect(text).toContain("Profile updated successfully");

      await expect(ProfilePage.nameInput).toHaveValue(newName);
      await expect(ProfilePage.emailInput).toHaveValue(email);
    }
  });

  it("TCEP_02: should not update if email missing '@'", async () => {
    await ProfilePage.updateProfile({
      name: originalProfile.name,
      email: "userexample.com",
    });

    await ProfilePage.toast.waitForDisplayed({ timeout: 5000 });
    const text = await ProfilePage.toast.getText();
    expect(text).toContain("Invalid email format"); // chỉnh theo message thực tế
  });

  it("TCEP_03: should not update if email has more than one '@'", async () => {
    await ProfilePage.updateProfile({
      name: originalProfile.name,
      email: "user@@example.com",
    });

    await ProfilePage.toast.waitForDisplayed({ timeout: 5000 });
    const text = await ProfilePage.toast.getText();
    expect(text).toContain("Invalid email format");
  });

  it("TCEP_04: should not update if email missing domain name", async () => {
    await ProfilePage.updateProfile({
      name: originalProfile.name,
      email: "user@",
    });

    await ProfilePage.toast.waitForDisplayed({ timeout: 5000 });
    const text = await ProfilePage.toast.getText();
    expect(text).toContain("Invalid email format");
  });

  it("TCEP_05: should not update if email missing '.' in domain", async () => {
    await ProfilePage.updateProfile({
      name: originalProfile.name,
      email: "user@examplecom",
    });

    await ProfilePage.toast.waitForDisplayed({ timeout: 5000 });
    const text = await ProfilePage.toast.getText();
    expect(text).toContain("Invalid email format");
  });

  it("TCEP_06: should not update if email contains space", async () => {
    await ProfilePage.updateProfile({
      name: originalProfile.name,
      email: "user name@example.com",
    });

    await ProfilePage.toast.waitForDisplayed({ timeout: 5000 });
    const text = await ProfilePage.toast.getText();
    expect(text).toContain("Invalid email format");
  });

  it("TCEP_07: should not update if email has disallowed special char", async () => {
    await ProfilePage.updateProfile({
      name: originalProfile.name,
      email: "user!tag@example.com",
    });

    await ProfilePage.toast.waitForDisplayed({ timeout: 5000 });
    const text = await ProfilePage.toast.getText();
    expect(text).toContain("Invalid email format");
  });

  it("TCEP_08: should not update if email field is empty", async () => {
    await ProfilePage.updateProfile({
      name: originalProfile.name,
      email: "",
    });

    await ProfilePage.toast.waitForDisplayed({ timeout: 5000 });
    const text = await ProfilePage.toast.getText();
    expect(text).toContain("Email is required");
  });

  it("TCEP_09: should not update if name field is empty", async () => {
    await ProfilePage.updateProfile({
      name: "",
      email: originalProfile.email,
    });

    await ProfilePage.toast.waitForDisplayed({ timeout: 5000 });
    const text = await ProfilePage.toast.getText();
    expect(text).toContain("Name is required");
  });
});