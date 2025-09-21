import Page from "../page";

class ShippingPage extends Page {
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
