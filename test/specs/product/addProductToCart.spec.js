import HomePage from "../../pageobjects/home.page";
import ProductPage from "../../pageobjects/product/product.page";
import LoginPage from "../../pageobjects/auth/login.page";
import CartPage from "../../pageobjects/product/cart.page";
describe("Adding product to cart", () => {
  before(async () => {
    await browser.maximizeWindow();
    await HomePage.open();
  });

  afterEach(async () => {
    await browser.execute(() => localStorage.removeItem("cart"));
  });

  it("TCPO_01: Verify that a user can successfully add a product to cart", async () => {
    // Open homepage and click the first product
    await HomePage.waitForProductListToLoad();
    const href = await HomePage.getProductHrefByIndex(0);
    await HomePage.openProductbyIndex(0);

    // Verify product page URL
    await expect(browser).toHaveUrl(expect.stringContaining(href), { timeout: 5000 });
    //add to cart
    await ProductPage.setProductQuantity(3);
    await ProductPage.clickAddToCartButton();
    //url cart
    await expect(browser).toHaveUrl(expect.stringContaining("/cart"), { timeout: 5000 });
    // body
    const subtotal = await CartPage.getSubtotalQuantity();
    const checkoutBtn = await CartPage.checkoutButton;
    const name = await CartPage.getProductNameByIndex(0);
    const price = await CartPage.getProductPriceByIndex(0);
    const qty = await CartPage.getProductQuantityByIndex(0);
    const dltBtn = await CartPage.getProductDeleteButtonByIndex(0);

    await expect(subtotal).toBe(3, { timeout: 5000 });
    await expect(checkoutBtn).toBeDisplayed({ timeout: 5000 });
    await expect(dltBtn).toBeDisplayed({ timeout: 5000 });
    await expect(name).toEqual("Airpods Wireless Bluetooth Headphones");
    await expect(price).toEqual("$89.99");
    await expect(qty).toBe("3");

    //badge
    const total = await ProductPage.cartIconCount.getText();
    await expect(total).toBe("3");
  });

  it("TCPO_02: Verify adding the same product multiple times updates quantity correctly", async () => {
    // Step 1: Open the home page and navigate to the first product's page.
    await HomePage.open();
    await HomePage.waitForProductListToLoad();
    await HomePage.openProductbyIndex(0);

    // Step 2: Set the quantity to 1 and add the product to the cart.
    const firstQty = 1;
    await ProductPage.setProductQuantity(firstQty);
    await ProductPage.clickAddToCartButton();

    // Step 3: Go back to the home page and navigate to the same product again.
    await HomePage.open();
    await HomePage.waitForProductListToLoad();
    await HomePage.openProductbyIndex(0);

    // Step 4: Set a new quantity and add the product again.
    const secondQty = 3;
    await ProductPage.setProductQuantity(secondQty);
    await ProductPage.clickAddToCartButton();

    // Step 5: Navigate to the cart page.
    await expect(browser).toHaveUrl(expect.stringContaining("/cart"), { timeout: 5000 });

    // Step 6: Verify there is only one line item in the cart.
    const cartItems = await CartPage.cartItems;
    await expect(cartItems.length).toBe(1);

    // Step 7: Verify the product's quantity is last add to cart
    const productQty = await CartPage.getProductQuantityByIndex(0);
    await expect(productQty).toEqual(secondQty.toString());

    // Step 8: Verify the subtotal quantity and price are correct.
    const subtotalQty = await CartPage.getSubtotalQuantity();
    await expect(subtotalQty).toBe(secondQty);

    //badge
    const total = await ProductPage.cartIconCount.getText();
    await expect(total).toBe("3");
    const productPriceText = await CartPage.getProductPriceByIndex(0);
    const productPrice = parseFloat(productPriceText.replace("$", ""));
    const expectedSubtotalPrice = Number((productPrice * secondQty).toFixed(2));

    const actualSubtotalPrice = await CartPage.getSubtotalPrice();
    await expect(actualSubtotalPrice).toBeCloseTo(expectedSubtotalPrice, 2);
  });

  it("TCPO_03: Verify a user can add many different products to the cart successfully", async () => {
    const productsToAdd = [
      { index: 0, quantity: 1, name: "Airpods Wireless Bluetooth Headphones", price: 89.99 },
      { index: 1, quantity: 2, name: "iPhone 13 Pro 256GB Memory", price: 599.99 },
      { index: 2, quantity: 3, name: "Cannon EOS 80D DSLR Camera", price: 929.99 },
    ];

    let expectedTotalPrice = 0;
    let expectedTotalItems = 0;

    for (const product of productsToAdd) {
      await HomePage.open();
      await HomePage.waitForProductListToLoad();
      await HomePage.openProductbyIndex(product.index);

      await ProductPage.setProductQuantity(product.quantity);
      await ProductPage.clickAddToCartButton();

      // Update totals as each product is added
      expectedTotalItems += product.quantity;
      expectedTotalPrice += product.quantity * product.price;

      // Verify cart icon count after each addition
      const cartIconCount = await ProductPage.cartIconCount.getText();
      await expect(cartIconCount).toBe(expectedTotalItems.toString());
    }

    // Navigate to the cart page for final verification
    await CartPage.open();
    // --- Final Assertions on the Cart Page ---

    // Verify total item count in the header
    const subtotalQty = await CartPage.getSubtotalQuantity();
    await expect(subtotalQty).toBe(expectedTotalItems);

    // Verify each product's details in the cart
    const cartItems = await CartPage.cartItems;
    await expect(cartItems.length).toBe(productsToAdd.length);

    // Loop through cart items to verify details
    for (let i = 0; i < productsToAdd.length; i++) {
      const productData = productsToAdd[i];

      const actualName = await CartPage.getProductNameByIndex(i);
      await expect(actualName).toEqual(productData.name);

      const actualQty = await CartPage.getProductQuantityByIndex(i);
      await expect(actualQty).toEqual(productData.quantity.toString());

      const actualPrice = await CartPage.getProductPriceByIndex(i);
      await expect(actualPrice).toEqual(`$${productData.price.toFixed(2)}`);
    }

    // Verify the final total price
    const actualTotalPrice = await CartPage.getSubtotalPrice();
    await expect(actualTotalPrice).toBeCloseTo(expectedTotalPrice, 2);
  });
  it("TCPO_04: Verify cart is empty when no items are added", async () => {
    //1: Navigate directly to the cart page
    await CartPage.open();

    // Step 3: Verify the empty cart message and link are displayed
    await expect(CartPage.emptyCartMessage).toBeDisplayed({ timeout: 5000 });
    await expect(await CartPage.emptyCartMessage.getText()).toEqual("Your cart is empty Go Back");

    // Step 4: Verify the subtotal shows "0 items"
    const subtotalQty = await CartPage.getSubtotalQuantity();
    await expect(subtotalQty).toBe(0);

    // Step 5: Verify "Proceed To Checkout" button is disabled
    await expect(CartPage.checkoutButton).toBeDisabled({ timeout: 5000 });

    // Step 6: Verify the total price is $0.00
    // This assertion may not be applicable if the total price is not shown
    // or if your `getSubtotalPrice` method cannot handle this state.
    const actualSubtotalPrice = await CartPage.getSubtotalPrice();
    await expect(actualSubtotalPrice).toBe(0);
  });
  it("TCPO_05: Verify product availability is displayed correctly", async () => {
    // Navigate to the home page and wait for products to load
    await HomePage.open();
    await HomePage.waitForProductListToLoad();

    // --- Scenario 1: In Stock Product ---
    const inStockProductIndex = 0;
    await HomePage.openProductbyIndex(inStockProductIndex);

    // Assert "In Stock" label is displayed
    await expect(ProductPage.productStatus).toHaveText("In Stock", { timeout: 5000 });
    // Assert "Add To Cart" button is enabled
    await expect(ProductPage.addToCartButton).toBeEnabled({ timeout: 5000 });

    // Go back to the homepage for the next scenario
    await browser.back();
    await HomePage.waitForProductListToLoad();

    // --- Scenario 2: Out of Stock Product ---
    const outOfStockProductIndex = 5;
    await HomePage.openProductbyIndex(outOfStockProductIndex);

    // Assert "Out of Stock" label is displayed
    await expect(ProductPage.productStatus).toHaveText("Out Of Stock", { timeout: 5000 });
    // Assert "Add To Cart" button is disabled
    await expect(ProductPage.addToCartButton).toBeDisabled({ timeout: 5000 });
  });
  it("TCPO_06: Verify that a new user does not inherit the previous user’s cart", async () => {
    // --- User 1: Add items to cart ---
    const user1 = { email: "admin@email.com", password: "123456" };
    const user2 = { email: "john@email.com", password: "123456" };

    // Step 1: Login with the first user
    await LoginPage.open();
    await LoginPage.login(user1.email, user1.password);

    // Step 2 & 3: Add a product to the cart
    const desiredQuantity = 2;
    await HomePage.waitForProductListToLoad();
    await HomePage.openProductbyIndex(0);
    await ProductPage.setProductQuantity(desiredQuantity);
    await ProductPage.clickAddToCartButton();

    // Verify cart icon for user 1
    const cartIconCountUser1 = await ProductPage.cartIconCount.getText();
    await expect(cartIconCountUser1).toBe(desiredQuantity.toString());

    // Step 4: Logout
    await HomePage.logOut();

    // --- User 2: Verify empty cart ---

    // Step 5: Login with a second valid account
    await LoginPage.open();
    await LoginPage.login(user2.email, user2.password);

    // Step 6: Navigate to the cart page
    await CartPage.open();

    // Step 7: Check Cart for second user
    // Assert cart is empty by checking for the empty cart message
    await expect(CartPage.emptyCartMessage).toBeDisplayed({ timeout: 5000 });
    await expect(await CartPage.emptyCartMessage.getText()).toEqual("Your cart is empty Go Back");

    // Assert subtotal shows 0 items and price is 0
    await expect(await CartPage.getSubtotalQuantity()).toBe(0);
    await expect(await CartPage.getSubtotalPrice()).toBe(0);
  });
});
