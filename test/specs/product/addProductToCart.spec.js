import HomePage from "../../pageobjects/home.page";
import ProductPage from "../../pageobjects/product/product.page";
import LoginPage from "../../pageobjects/auth/login.page";
import CartPage from "../../pageobjects/product/cart.page";
describe("Adding product to cart", () => {
  before(async () => {
    await browser.maximizeWindow();
    await LoginPage.open();
    await LoginPage.login("admin@email.com", "123456");
  });
  beforeEach(async () => {
    await HomePage.open();
  });

  it("TCPO_01: Verify that a user can successfully add product to cart", async () => {
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

  it("TCPO_03: Verify that user can add many different product to cart successfully", async () => {
    const products = [
      { index: 0, qty: 2 },
      { index: 1, qty: 1 },
      { index: 2, qty: 3 },
    ];
    let expectedSubtotal = 0;

    for (const product of products) {
      await HomePage.open();
      await HomePage.openProduct(product.index);
      await ProductPage.selectQuantity(product.qty);
      await ProductPage.addToCart();

      // Get unit price
      const priceEl = await CartPage.productPrice(0); // always first item added
      const priceText = await priceEl.getText();
      const priceNumber = parseFloat(priceText.replace("$", ""));
      expectedSubtotal += product.qty * priceNumber;
    }
    // Open cart
    await CartPage.openCart();

    // Verify number of items
    const items = await CartPage.cartItems();
    await expect(items.length).toBe(products.length);

    // Verify each quantity
    for (let i = 0; i < items.length; i++) {
      const qtyDropdown = await CartPage.productQuantityDropdown(i);
      const qty = parseInt(await qtyDropdown.getValue(), 10);
      await expect(qty).toBe(products[i].qty);
    }

    // Verify subtotal price
    const subtotalPrice = await CartPage.getSubtotalPrice();
    await expect(subtotalPrice).toBeCloseTo(expectedSubtotal, 2);
    console.log("Expected subtotal:", expectedSubtotal, "Actual subtotal:", subtotalPrice);
  });
  it("TCPO_04: Verify dropdown only shows numbers up to the available stock", () => {});
  it("TCPO_05: Verify cart is empty when no items are added", () => {});
  it("TCPO_06: Verify that product availability is displayed correctly", () => {});
});

// describe("check visablity", () => {
//
//   it("TCPO_07: Verify that a new user does not inherit the previous user’s cart", () => {});
//
//   it("TCPO_08: Add product without login", () => {});
//    navigate to homepage
//   beforeEach(async () => {
//     await ProductPage.openHomePage();
//   });
// });
