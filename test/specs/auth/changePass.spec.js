import { expect } from '@wdio/globals';
import LoginPage from '../../pageobjects/auth/login.page.js';
import HomePage from '../../pageobjects/auth/home.page.js';
import ProfilePage from '../../pageobjects/auth/profile.page.js';

describe('Epic 1 - Change Password', () => {
  const ORIGINAL_PASS = '150903';
  const ALT_PASS      = 'T!ger#R123';
  let originalProfile;

  before(async () => {
    await LoginPage.open();
    await LoginPage.login('editprofile@gmail.com', ORIGINAL_PASS);
    await expect(browser).toHaveUrl('http://localhost:3000/');
    await HomePage.navigateToProfile();
    await expect(browser).toHaveUrl('http://localhost:3000/profile');
    await expect(ProfilePage.nameInput).toBeDisplayed({ timeout: 10000 });
    originalProfile = await ProfilePage.getOriginalProfile();
  });

  beforeEach(async () => {
    if (!(await browser.getUrl()).includes('/profile')) {
      await ProfilePage.open();
      await expect(ProfilePage.nameInput).toBeDisplayed({ timeout: 10000 });
      await expect(ProfilePage.emailInput).toBeDisplayed({ timeout: 10000 });
    }
  });

  after(async () => {
    // 🔁 đảm bảo về password gốc sau toàn bộ suite
    await ProfilePage.updateProfile({ password: ORIGINAL_PASS, confirmPassword: ORIGINAL_PASS });
    await expect(ProfilePage.toastMessage).toBeDisplayed({ timeout: 10000 });
    await expect(ProfilePage.toastMessage).toHaveTextContaining('Password changed successfully');

    // trả lại name/email nếu có chỉnh
    await ProfilePage.updateProfile(originalProfile);
    // (đợi một nhịp rồi kết thúc)
    await browser.pause(300);
    await browser.reloadSession();
  });

  it('TCCP_01: should change password successfully with valid format', async () => {
    // đổi sang ALT
    await ProfilePage.updateProfile({ password: ALT_PASS, confirmPassword: ALT_PASS });
    await expect(ProfilePage.toastMessage).toBeDisplayed({ timeout: 10000 });
    await expect(ProfilePage.toastMessage).toHaveTextContaining('Password changed successfully');

    // đổi về ORIGINAL
    await ProfilePage.updateProfile({ password: ORIGINAL_PASS, confirmPassword: ORIGINAL_PASS });
    await expect(ProfilePage.toastMessage).toBeDisplayed({ timeout: 10000 });
    await expect(ProfilePage.toastMessage).toHaveTextContaining('Password changed successfully');
  });

  // invalid passwords format
  const invalidSamples = [
    { pw: '1234Abcd!',  note: 'Sequential characters (1234)' },
    { pw: 'Aaaa@1111',  note: 'Repeated characters (Aaaa / 1111)' },
    { pw: 'password',   note: 'Common password' },
    { pw: '12345678',   note: 'Common numeric password' },
    { pw: 'iloveyou',   note: 'Common phrase password' },
    { pw: 'Secure@Nhi', note: 'Contains personal info (name/email)' },
    { pw: 'SECURE@123', note: 'Missing lowercase' },
    { pw: 'SecurePass', note: 'Missing number & special char' },
    { pw: 'S@1a',       note: 'Too short (< 8 chars)' },
  ];

  invalidSamples.forEach(({ pw, note }, i) => {
    it(`TCCP_02.${i + 1}: should block when new password has invalid format - ${note}`, async () => {
      await ProfilePage.updateProfile({ password: pw, confirmPassword: pw });

      // ⭐ chờ 1 nhịp trước khi đọc toast (đủ chậm)
      await browser.pause(800);

      if (await ProfilePage.toastMessage.isExisting()) {
        const text = await ProfilePage.toastMessage.getText();
        expect(text.length).toBeGreaterThan(0);
        expect(text).not.toContain('Password changed successfully');
      } else {
        // fallback siêu gọn nếu không có toast
        const pMsg = await ProfilePage.passwordInput.getProperty('validationMessage');
        const cMsg = await ProfilePage.confirmPasswordInput.getProperty('validationMessage');
        const msg  = `${pMsg || ''} ${cMsg || ''}`.trim();
        expect(msg.length).toBeGreaterThan(0);
      }

      expect(await browser.getUrl()).toContain('/profile');
    });
  });

  it('TCCP_03: should block when new password and confirmation do not match', async () => {
    await ProfilePage.updateProfile({ password: 'Strong@1234', confirmPassword: 'Strong@123!' });

    // ⭐ chờ 1 nhịp rồi đọc toast
    await browser.pause(800);

    if (await ProfilePage.toastMessage.isExisting()) {
      const toastText = await ProfilePage.toastMessage.getText();
      expect(/passwords?\s+do\s+not\s+match/i.test(toastText)).toBe(true);
    } else {
      // fallback native
      const pMsg = await ProfilePage.passwordInput.getProperty('validationMessage');
      const cMsg = await ProfilePage.confirmPasswordInput.getProperty('validationMessage');
      const msg  = `${pMsg || ''} ${cMsg || ''}`.trim();
      expect(/do\s+not\s+match|không\s+khớp/i.test(msg)).toBe(true);
    }
  });
});
//   it('TCCP_04: should block when new password matches a previously used password', async function () {
//     // Cần set env PREV_USED_PASS = một mật khẩu hợp lệ đã từng dùng trong hệ thống
//     const reused = process.env.PREV_USED_PASS;
//     if (!reused) {
//       console.warn('SKIP TCCP_04: set PREV_USED_PASS để kiểm thử reuse history.');
//       this.skip(); // chỉ dùng được với function()
//     }

//     await ProfilePage.updateProfile({ password: reused, confirmPassword: reused });

//     const msg = await getPasswordError();
//     console.log('Reuse history =>', msg);

//     // Có thông báo lỗi (ví dụ: cannot reuse / previously used / history / already used)
//     expect(msg.length).toBeGreaterThan(0);
//     if (await ProfilePage.toastMessage.isExisting()) {
//       await expect(ProfilePage.toastMessage).not.toHaveTextContaining('Password changed successfully');
//     }
//   });
});