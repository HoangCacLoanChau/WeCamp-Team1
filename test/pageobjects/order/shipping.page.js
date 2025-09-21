import Page from "../page";

class ShippingPage extends Page {
  get inputAddress() {
    return $("#address");
  }
  get inputCity() {
    return $("#city");
  }
  get inputPostalCode() {
    return $("#postalCode");
  }
  get inputCountry() {
    return $("#country");
  }
  get btnContinue() {
    return $("button=Continue");
  }
  get btnPlaceOrder() {
    return $('//button[normalize-space()="Place Order"]');
  }

  async open() {
    await browser.url("/shipping");
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
  // Page element selectors
  get addressInput() {
    return $("#address");
  }

  get cityInput() {
    return $("#city");
  }

  get postalCodeInput() {
    return $("#postalCode");
  }

  get countryInput() {
    return $("#country");
  }

  get continueButton() {
    return $("button=Continue");
  }

  // A method to open the shipping page directly
  async open() {
    await super.open("shipping");
  }
  async isInputValid(inputElement) {
    // The isInvalid() command returns true if the element is invalid.
    // We invert the result to return true for a valid state.
    return !(await inputElement.isInvalid());
  }
  async fillShippingDetails(address, city, postalCode, country) {
    await this.addressInput.setValue(address);
    await this.cityInput.setValue(city);
    await this.postalCodeInput.setValue(postalCode);
    await this.countryInput.setValue(country);
  }
}

export default new ShippingPage();
