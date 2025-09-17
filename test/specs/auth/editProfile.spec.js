import LoginPage from "../../pageobjects/auth/login.page";
import HomePage from "../../pageobjects/auth/home.page";
import ProfilePage from "../../pageobjects/auth/profile.page";

describe("Profile Update", () => {
  beforeEach(async () => {
    // Login trước mỗi case
    await LoginPage.open();
    await LoginPage.login("user@example.com", "pqh231180");
    await expect(browser).toHaveUrl("http://localhost:3000/");
    await HomePage.navigateToProfile();
    await expect(browser).toHaveUrl("http://localhost:3000/profile");
  });

  it("Verify profile can be updated with valid email", async () => {
    const originalName = "Phạm Bùi Linh Nhi";         // Name/email ban đầu
    const originalEmail = "pblinnhi@gmail.com";

    const newName = "Nhi Phạm";
    const validEmails = [
      "user@example.com",
      "firstname.lastname@domain.com.au",
      "usertag@do-main.com",
      "user_tag@domain.com"
    ];

    // chạy lần lượt với các email hợp lệ
    for (const email of validEmails) {
      await ProfilePage.updateProfile({ name: newName, email });

      // Toast thông báo
      const toast = await ProfilePage.toast;
      await expect(toast).toHaveText("Profile updated successfully");

      // Xác nhận input hiển thị giá trị mới
      await expect(ProfilePage.nameInput).toHaveValue(newName);
      await expect(ProfilePage.emailInput).toHaveValue(email);
    }

    // Reset về thông tin gốc
    await ProfilePage.updateProfile({ name: originalName, email: originalEmail });

    const resetToast = await ProfilePage.toast;
    await expect(resetToast).toHaveText("Profile updated successfully");

    await expect(ProfilePage.nameInput).toHaveValue(originalName);
    await expect(ProfilePage.emailInput).toHaveValue(originalEmail);
  });
});