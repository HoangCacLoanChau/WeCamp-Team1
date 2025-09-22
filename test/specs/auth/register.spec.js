import RegisterPage from "../../pageobjects/auth/register.page";

describe("Registration Tests", () => {
  beforeEach(async () => {
    await RegisterPage.open();
  });
  afterEach(async () => {
    await browser.execute(() => localStorage.clear());
  });
  it("TCSU_01 - Successful registration with an valid email and password and navigated to Home page", async () => {
    const email = `newuser_${Date.now()}@gmail.com`;
    await RegisterPage.register("User", email, "Password@123", "Password@123");
    await expect(browser).toHaveUrl("http://localhost:3000/");
  });
  it('TCSU_02 - Successful registration with an email containing periods "." and navigated to Home page', async () => {
    const email = `new.user_${Date.now()}@gmail.com`;
    await RegisterPage.register("User", email, "Password@123", "Password@123");
    await expect(browser).toHaveUrl("http://localhost:3000/");
  });
  it('TCSU_03 - Successful registration with an email containing hyphen "-" and navigated to Home page', async () => {
    const email = `newuser_${Date.now()}@gmail-main.com`;
    await RegisterPage.register("User", email, "Password@123", "Password@123");
    await expect(browser).toHaveUrl("http://localhost:3000/");
  });
  it('TCSU_04 - Successful registration with an email containing underscore "_" and navigated to Home page', async () => {
    const email = `new_user_${Date.now()}@gmail.com`;
    await RegisterPage.register("User", email, "Password@123", "Password@123");
    await expect(browser).toHaveUrl("http://localhost:3000/");
  });
  it('TCSU_05 - Successful registration with an email containing hyphen "-"in domain and navigated to Home page', async () => {
    const email = `newuser_${Date.now()}@gmail_main.com`;
    await RegisterPage.register("User", email, "Password@123", "Password@123");
    await expect(browser).toHaveUrl("http://localhost:3000/");
  });
  it("TCSU_06 - Successful registration with an email containing subdomain and navigated to Home page", async () => {
    const email = `newuser_${Date.now()}@gmail.com.vn`;
    await RegisterPage.register("User", email, "Password@123", "Password@123");
    await expect(browser).toHaveUrl("http://localhost:3000/");
  });
  it("TCSU_07 - Successful registration with an email containing numbers and navigated to Home page", async () => {
    const email = `newuser123_${Date.now()}@gmail.com`;
    await RegisterPage.register("User", email, "Password@123", "Password@123");
    await expect(browser).toHaveUrl("http://localhost:3000/");
  });
  it('TCSU_08 - Registration fails with email missing "@" symbol and show error message', async () => {
    const email = `newuser_${Date.now()}gmail.com`;
    await RegisterPage.register("User", email, "Password@123", "Password@123");
    // Check validity state
    const isValid = await RegisterPage.emailInput.getProperty("validity");
    expect(isValid.valid).toBe(false);
    // Check validation message text
    const errorMsg = await RegisterPage.emailInput.getProperty("validationMessage");
    await expect(errorMsg).toContain(
      `Please include an '@' in the email address. '${email}' is missing an '@'.`,
    );
  });
  it("TCSU_09 - Registration fails with email missing domain and show error message", async () => {
    const email = `newuser_${Date.now()}@`;
    await RegisterPage.register("User", email, "Password@123", "Password@123");
    const isValid = await RegisterPage.emailInput.getProperty("validity");
    expect(isValid.valid).toBe(false);
    const errorMsg = await RegisterPage.emailInput.getProperty("validationMessage");
    await expect(errorMsg).toContain(
      `Please enter a part following '@'. '${email}' is incomplete.`,
    );
  });
  it('TCSU_10 - Registration fails with email missing periods "." symbol and show error message', async () => {
    const email = `newuser_${Date.now()}@gmailcom`;
    await RegisterPage.register("User", email, "Password@123", "Password@123");
    await browser.pause(500);
    await expect(browser).toHaveUrl("http://localhost:3000/register");
    const isValid = await RegisterPage.emailInput.getProperty("validity");
    expect(isValid.valid).toBe(false);
  });
  it("TCSU_11 - Registration fails with email containing invalid special characters and show error message", async () => {
    const email = `new$user_${Date.now()}@gmail.com`;
    await RegisterPage.register("User", email, "Password@123", "Password@123");
    await browser.pause(500);
    await expect(browser).toHaveUrl("http://localhost:3000/register");
    const isValid = await RegisterPage.emailInput.getProperty("validity");
    expect(isValid.valid).toBe(false);
  });
  it("TCSU_12 - Registration fails with email containing spaces and show error message", async () => {
    const email = `new user_${Date.now()}@gmail.com`;
    await RegisterPage.register("User", email, "Password@123", "Password@123");
    const isValid = await RegisterPage.emailInput.getProperty("validity");
    expect(isValid.valid).toBe(false);
    const errorMsg = await RegisterPage.emailInput.getProperty("validationMessage");
    await expect(errorMsg).toContain(`A part followed by '@' should not contain the symbol ' '.`);
  });
  it("TCSU_13 - Registration fails with email containing eading or trailing spaces and show error message", async () => {
    const email = ` newuser_${Date.now()}@gmail.com `;
    await RegisterPage.register("User", email, "Password@123", "Password@123");
    const isValid = await RegisterPage.emailInput.getProperty("validity");
    expect(isValid.valid).toBe(false);
  });
  it("TCSU_14 - Registration fails with email containing invalid special characters in domain and show error message", async () => {
    const email = `newuser_${Date.now()}@gmail#.com`;
    await RegisterPage.register("User", email, "Password@123", "Password@123");
    const isValid = await RegisterPage.emailInput.getProperty("validity");
    expect(isValid.valid).toBe(false);
    const errorMsg = await RegisterPage.emailInput.getProperty("validationMessage");
    await expect(errorMsg).toContain(`A part following '@' should not contain the symbol '#'.`);
  });
  it("TCSU_15 - Registration fails with email missing characters before domain and show error message", async () => {
    await RegisterPage.register("User", "@gmail.com", "Password@123", "Password@123");
    const isValid = await RegisterPage.emailInput.getProperty("validity");
    expect(isValid.valid).toBe(false);
    const errorMsg = await RegisterPage.emailInput.getProperty("validationMessage");
    await expect(errorMsg).toContain(
      `Please enter a part followed by '@'. '@gmail.com' is incomplete.`,
    );
  });
  it("TCSU_16 - Registration fails with password less than 8 characters", async () => {
    const email = `newuser_${Date.now()}@gmail.com`;
    await RegisterPage.register("User", email, "Pass@12", "Pass@12");
    const isValid = await RegisterPage.emailInput.getProperty("validity");
    expect(isValid.valid).toBe(false);
  });
  it("TCSU_17 - Registration fails with password no uppercase letters", async () => {
    const email = `newuser_${Date.now()}@gmail.com`;
    await RegisterPage.register("User", email, "password@123", "password@123");
    const isValid = await RegisterPage.emailInput.getProperty("validity");
    expect(isValid.valid).toBe(false);
  });
  it("TCSU_18 - Registration fails with password no lowercase letters", async () => {
    const email = `newuser_${Date.now()}@gmail.com`;
    await RegisterPage.register("User", email, "PASSWORD@123", "PASSWORD@123");
    const isValid = await RegisterPage.emailInput.getProperty("validity");
    expect(isValid.valid).toBe(false);
  });
  it("TCSU_19 - Registration fails with password no numbers", async () => {
    const email = `newuser_${Date.now()}@gmail.com`;
    await RegisterPage.register("User", email, "Password@abc", "Password@abc");
    const isValid = await RegisterPage.emailInput.getProperty("validity");
    expect(isValid.valid).toBe(false);
  });
  it("TCSU_20 - Registration fails with password no special character", async () => {
    const email = `newuser_${Date.now()}@gmail.com`;
    await RegisterPage.register("User", email, "Password1abc", "Password1abc");
    const isValid = await RegisterPage.emailInput.getProperty("validity");
    expect(isValid.valid).toBe(false);
  });
  it("TCSU_21 - Registration fails with password has sequential/ repeated characters", async () => {
    const email = `newuser_${Date.now()}@gmail.com`;
    await RegisterPage.register("User", email, "Password1@aaaa", "Password1@aaaa");
    const isValid = await RegisterPage.emailInput.getProperty("validity");
    expect(isValid.valid).toBe(false);
  });
  it("TCSU_22 - Registration fails with common password", async () => {
    const email = `newuser_${Date.now()}@gmail.com`;
    await RegisterPage.register("User", email, "iloveyou", "iloveyou");
    const isValid = await RegisterPage.emailInput.getProperty("validity");
    expect(isValid.valid).toBe(false);
  });
  it("TCSU_23 - Registration fails with password containing personal information", async () => {
    const email = `newuser_${Date.now()}@gmail.com`;
    await RegisterPage.register("User", email, "Newuser@123", "Newuser@123");
    const isValid = await RegisterPage.emailInput.getProperty("validity");
    expect(isValid.valid).toBe(false);
  });
  it("TCSU_24 - Registration fails with wrong confirm", async () => {
    const email = `newuser_${Date.now()}@gmail.com`;
    await RegisterPage.register("User", email, "Password@123", "Password@234");
    await expect(RegisterPage.toast).toHaveText("Passwords do not match");
  });
  it("TCSU_25 - Registration fails with an already registered email", async () => {
    await RegisterPage.register("User", "user@gmail.com", "Password@123", "Password@123");
    await expect(RegisterPage.toast).toHaveText("User already exists");
  });
  it("TCSU_26 - Registration fails with the email field is empty", async () => {
    await RegisterPage.register("User", "", "Password@123", "Password@123");
    await expect(RegisterPage.toast).toHaveText(
      "User validation failed: email: Path `email` is required.",
    );
  });
  it("TCSU_27 - Registration fails with the password field is empty", async () => {
    const email = `newuser_${Date.now()}@gmail.com`;
    await RegisterPage.register("User", email, "", "Password@123");
    await expect(RegisterPage.toast).toHaveText("Passwords do not match");
  });
  it("TCSU_28 - Registration fails with the name field is empty", async () => {
    const email = `newuser_${Date.now()}@gmail.com`;
    await RegisterPage.register("", email, "Password@123", "Password@123");
    await expect(RegisterPage.toast).toHaveText(
      "User validation failed: name: Path `name` is required.",
    );
  });
  it("TCSU_29 - Registration fails with the confirm password field is empty", async () => {
    const email = `newuser_${Date.now()}@gmail.com`;
    await RegisterPage.register("User", email, "Password@123", "");
    await expect(RegisterPage.toast).toHaveText("Passwords do not match");
  });
  it("TCSU_30 - Registration fails with all field is empty", async () => {
    await RegisterPage.register("", "", "", "");
    await expect(RegisterPage.toast).toHaveText(
      "User validation failed: name: Path `name` is required., email: Path `email` is required., password: Path `password` is required.",
    );
  });
});
