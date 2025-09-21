class ShippingPage {
  get inputAddress() { return $('#address'); }
  get inputCity() { return $('#city'); }
  get inputPostalCode() { return $('#postalCode'); }
  get inputCountry() { return $('#country'); }
  get btnContinue() { return $('button=Continue'); }
  get btnPlaceOrder() { return $('//button[normalize-space()="Place Order"]'); }

  async open() {
    await browser.url('/shipping');
  }

  async fillShippingInfo({ address, city, postalCode, country }) {
    await this.inputAddress.setValue(address);
    await this.inputCity.setValue(city);
    await this.inputPostalCode.setValue(postalCode);
    await this.inputCountry.setValue(country);
    await this.btnContinue.click();
  }

  async placeOrder() {
    await this.btnPlaceOrder.waitForClickable({ timeout: 10000 });
    await this.btnPlaceOrder.click();
  }
}

export default new ShippingPage();