class ProductPage {
  //header
  get cartIconCount() {
    return $(".badge");
  }
  // Page element selectors
  get goBackButton() {
    return $(".btn.btn-light");
  }

  get productImage() {
    return $(".col-md-6 img");
  }

  get productName() {
    return $(".col-md-3 .list-group-item h3");
  }

  get productPrice() {
    return $(".list-group-item strong");
  }

  get productStatus() {
    return $(".list-group-item .row .col:nth-child(2)");
  }

  get quantitySelect() {
    return $(".col-md-3 .form-control");
  }

  get addToCartButton() {
    return $(".btn-block.btn.btn-primary");
  }

  get reviewSectionTitle() {
    return $(".review h2");
  }

  get reviewAlert() {
    return $(".alert.alert-info");
  }

  // Method to get the product name
  async getProductName() {
    return (await this.productName).getText();
  }

  // Method to get the product price
  async getProductPrice() {
    return (await this.productPrice).getText();
  }

  // Method to get the product status (e.g., "In Stock")
  async getProductStatus() {
    return (await this.productStatus).getText();
  }

  // Method to set the product quantity
  async setProductQuantity(quantity) {
    await this.quantitySelect.selectByVisibleText(quantity.toString());
  }

  // Method to click the "Add To Cart" button
  async clickAddToCartButton() {
    await this.addToCartButton.click();
  }

  // Method to check if the product is in stock
  async isProductInStock() {
    const statusText = await this.getProductStatus();
    return statusText.includes("In Stock");
  }

  // Method to click the "Go Back" button
  async goBack() {
    await this.goBackButton.click();
  }
}

export default new ProductPage();
