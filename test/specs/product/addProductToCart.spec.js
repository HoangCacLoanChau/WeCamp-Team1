import HomePage from "../../pageobjects/home.page";
import ProductPage from "../../pageobjects/product/product.page";
import LoginPage from "../../pageobjects/auth/login.page";
import CartPage from "../../pageobjects/product/cart.page";
describe("Adding product to cart", () => {
  before(async () => {
    await browser.maximizeWindow();
  });
  beforeEach(async () => {
    await HomePage.open();
  });
  afterEach(async () => {
    await browser.execute(() => localStorage.removeItem("cart"));
  });

  it("TCPO_01: Verify that a user can successfully add product to cart", async () => {
    await LoginPage.open();
    await LoginPage.login("john@email.com", "123456");
    // Open homepage and first product
    const href = await HomePage.getProductHref(0);
    await HomePage.openProduct(0);

    // Verify product page
    await expect(browser).toHaveUrl(expect.stringContaining(href), { timeout: 5000 });

    // Add to cart
    await ProductPage.selectQuantity(2);
    await ProductPage.addToCart();

    // Open Cart Page
    await CartPage.openCart();

    // Verify cart item elements with timeout
    const productName = await CartPage.productName(0);
    await expect(productName).toHaveText("iPhone 13 Pro 256GB Memory", { timeout: 5000 });

    const productPrice = await CartPage.productPrice(0);
    await expect(productPrice).toHaveText("$599.99", { timeout: 5000 });

    const qtyDropdown = await CartPage.productQuantityDropdown(0);
    await expect(qtyDropdown).toHaveValue("2", { timeout: 5000 });

    const deleteBtn = await CartPage.deleteButton(0);
    await expect(deleteBtn).toBeDisplayed({ timeout: 5000 });

    const cartBadge = await CartPage.cartIconCount;
    await expect(cartBadge).toHaveText("2", { timeout: 5000 });

    const checkoutBtn = await CartPage.checkOutBtn;
    await expect(checkoutBtn).toBeDisplayed({ timeout: 5000 });
  });

  it("TCPO_02: Verify adding the same product multiple times updates quantity correctly", async () => {
    // Step 1-4: Add product first time
    await HomePage.open();
    const href = await HomePage.getProductHref(0);
    await HomePage.openProduct(0);
    await ProductPage.selectQuantity(1);
    await ProductPage.addToCart();

    // Step 5-8: Add same product again
    await HomePage.open();
    await HomePage.openProduct(0);
    await ProductPage.selectQuantity(3); // Can change to another number
    await ProductPage.addToCart();

    // Step 9: Open cart
    await CartPage.openCart();

    // Verify no duplicate line item
    const items = await CartPage.cartItems();
    await expect(items.length).toBe(1);

    // Verify quantity is last selected
    const qtyDropdown = await CartPage.productQuantityDropdown(0);
    await expect(qtyDropdown).toHaveValue("3", { timeout: 5000 });

    // Verify total price updates correctly
    const price = await CartPage.productPrice(0);
    await expect(price).toHaveText("$599.99", { timeout: 5000 });

    // Verify cart icon updates
    await expect(await CartPage.cartIconCount).toHaveText("3", { timeout: 5000 });
    //caculate total price
    const qtyValue = parseInt(await qtyDropdown.getValue(), 10);
    const priceText = await price.getText(); // "$599.99"
    const priceNumber = parseFloat(priceText.replace("$", ""));
    const expectedSubtotal = +(qtyValue * priceNumber).toFixed(2);

    // card total
    const subtotalQty = await CartPage.getSubtotalQuantity();
    const subtotalPrice = await CartPage.getSubtotalPrice();
    await expect(subtotalQty).toBe(qtyValue, { timeout: 5000 });
    await expect(subtotalPrice).toBe(expectedSubtotal, { timeout: 5000 });
  });

  it("TCPO_03: Verify that user can add many different products to cart successfully", async () => {
    let expectedSubtotal = 0;

    // Add product 1 (index 0, qty 2)
    await HomePage.open();
    await HomePage.openProduct(0);
    await ProductPage.selectQuantity(2);
    await ProductPage.addToCart();

    // Add product 2 (index 1, qty 1)
    await HomePage.open();
    await HomePage.openProduct(1);
    await ProductPage.selectQuantity(1);
    await ProductPage.addToCart();

    // Add product 3 (index 2, qty 3)
    await HomePage.open();
    await HomePage.openProduct(2);
    await ProductPage.selectQuantity(3);
    await ProductPage.addToCart();

    // Open cart
    await CartPage.openCart();

    // Get all items in cart
    const items = await CartPage.cartItems();
    await expect(items.length).toBe(3);

    // --- Item 1 ---
    const nameEl1 = await items[0].$("a");
    const name1 = await nameEl1.getText();

    const qtyDropdown1 = await items[0].$("select.form-control");
    const qty1 = parseInt(await qtyDropdown1.getValue(), 10);

    const priceEl1 = await items[0].$(".col-md-2:nth-child(3) strong, .col strong");
    const priceText1 = await priceEl1.getText();
    const price1 = parseFloat(priceText1.replace("$", ""));

    expectedSubtotal += qty1 * price1;
    console.log(`Item ${name1} quantity: ${qty1} unit price: ${price1}`);

    // --- Item 2 ---
    const nameEl2 = await items[1].$("a");
    const name2 = await nameEl2.getText();

    const qtyDropdown2 = await items[1].$("select.form-control");
    const qty2 = parseInt(await qtyDropdown2.getValue(), 10);

    const priceEl2 = await items[1].$(".col-md-2:nth-child(3) strong, .col strong");
    const priceText2 = await priceEl2.getText();
    const price2 = parseFloat(priceText2.replace("$", ""));

    expectedSubtotal += qty2 * price2;
    console.log(`Item ${name2} quantity: ${qty2} unit price: ${price2}`);

    // --- Item 3 ---
    const nameEl3 = await items[2].$("a");
    const name3 = await nameEl3.getText();

    const qtyDropdown3 = await items[2].$("select.form-control");
    const qty3 = parseInt(await qtyDropdown3.getValue(), 10);

    const priceEl3 = await items[2].$(".col-md-2:nth-child(3) strong, .col strong");
    const priceText3 = await priceEl3.getText();
    const price3 = parseFloat(priceText3.replace("$", ""));

    expectedSubtotal += qty3 * price3;
    console.log(`Item ${name3} quantity: ${qty3} unit price: ${price3}`);

    // Verify subtotal
    const subtotalPrice = await CartPage.getSubtotalPrice();
    await expect(subtotalPrice).toBeCloseTo(expectedSubtotal, 2);

    console.log("Expected subtotal:", expectedSubtotal, "Actual subtotal:", subtotalPrice);
  });

  it("TCPO_05: Verify cart is empty when no items are added", async () => {
    // Clear cart from localStorage

    await CartPage.openCart();

    // Verify alert is displayed
    await expect(await CartPage.isCartEmpty()).toBe(true);

    // Optionally check text
    const text = await CartPage.getEmptyCartText();
    await expect(text).toContain("Your cart is empty");
    console.log("Empty cart alert text:", text);
  });

  it("TCPO_06: Verify that product availability is displayed correctly", async () => {
    // Product in stock
    await HomePage.openProduct(0);
    await expect(await ProductPage.getStockText()).toBe("In Stock");
    await expect(await ProductPage.isAddToCartEnabled()).toBe(true);
    await ProductPage.openHomePage();
    // Product out of stock
    await HomePage.openProduct(4);
    await expect(await ProductPage.getStockText()).toBe("Out of Stock");
    await expect(await ProductPage.isAddToCartEnabled()).toBe(false);
  });

  it("TCPO_07: Verify that a new user does not inherit the previous user’s cart after switching accounts", async () => {
    // --- Step 2-4: Add a product to cart ---
    await HomePage.openProduct(0); // first product
    await ProductPage.selectQuantity(2);
    await ProductPage.addToCart();

    // Verify cart has 1 item
    await CartPage.openCart();
    let items = await CartPage.cartItems();
    await expect(items.length).toBe(1);
    console.log("First user cart items:", items.length);

    // --- Step 5: Logout ---
    await HomePage.navigateToProfile();
    await HomePage.logoutMenuItem.click();

    // --- Step 6: Login with second valid account ---
    await LoginPage.open();
    await LoginPage.login("john@email.com", "123456");

    // --- Step 7: Check cart ---
    await CartPage.openCart();

    // Cart should be empty
    items = await CartPage.cartItems();
    await expect(items.length).toBe(0);

    // Check empty cart alert
    const emptyAlert = await CartPage.emptyCartAlert;
    await expect(emptyAlert).toBeDisplayed();
    const text = await emptyAlert.getText();
    await expect(text).toContain("Your cart is empty");

    console.log("Second user cart items:", items.length);

    // Optional: verify cart icon shows 0
    const cartCount = await CartPage.cartIconCount.getText();
    await expect(cartCount).toBe("0");
  });
  it("TCPO_08: Verify that adding product without login works or redirects to login", async () => {
    // Open homepage and select a product
    await HomePage.open();
    await HomePage.openProduct(0); // first product

    // Select quantity and try to add to cart
    await ProductPage.selectQuantity(2);
    await ProductPage.addToCart();

    // Open cart
    await CartPage.openCart();

    // Verify cart has the item
    const items = await CartPage.cartItems();
    await expect(items.length).toBe(1);

    const qtyDropdown = await CartPage.productQuantityDropdown(0);
    const qty = parseInt(await qtyDropdown.getValue(), 10);
    await expect(qty).toBe(2);

    const nameEl = await CartPage.productName(0);
    const name = await nameEl.getText();
    console.log(`Added to cart without login: ${name}, quantity: ${qty}`);
  });
});
