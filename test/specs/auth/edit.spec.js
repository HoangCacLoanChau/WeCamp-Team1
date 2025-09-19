// import { expect } from '@wdio/globals';
import LoginPage from '../../pageobjects/auth/login.page.js';
import HomePage from '../../pageobjects/home.page.js';
import ProfilePage from '../../pageobjects/auth/profile.page.js';

describe('TCEP_01 - Verify profile can be updated with valid email', () => {
  before(async () => {
    // 1. Mở trang login
    await LoginPage.open();

    // 2. Đăng nhập bằng account test
    await LoginPage.login("editprofile@gmail.com", "150903");

    // 3. Verify đã vào Homepage
    await expect(browser).toHaveUrl("http://localhost:3000/");

    // 4. Điều hướng từ Homepage sang Profile page
    await HomePage.navigateToProfile();

    // 5. Verify đã vào Profile page
    await expect(browser).toHaveUrl("http://localhost:3000/profile");
  });

  it('should update profile with a valid email and show success toast', async () => {
    // Test data cố định
    const newFullName = 'Test User Updated';
    const newEmail = 'user@example.com';

    // Thực hiện update
    await ProfilePage.updateProfile(newFullName, newEmail);

    // Verify toast hiển thị & nội dung đúng
    await expect(ProfilePage.toast).toBeDisplayed();
    await expect(ProfilePage.toast).toHaveTextContaining('Profile updated successfully');
  });
});