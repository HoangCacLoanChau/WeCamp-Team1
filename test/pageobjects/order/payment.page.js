import Page from "../page";

class PaymentPage extends Page {
  /**
   * Define page element selectors for the Payment page.
   */
  get pageTitle() {
    return $("h1=Payment Method");
  }

  get payPalRadioInput() {
    return $("#PayPal");
  }

  get payPalLabel() {
    return $('label[for="PayPal"]');
  }

  get continueButton() {
    return $("button=Continue");
  }

  /**
   * Action to select the PayPal payment method.
   */
  async selectPayPal() {
    if (!(await this.payPalRadioInput.isSelected())) {
      await this.payPalRadioInput.click();
    }
  }

  /**
   * Clicks the "Continue" button to proceed to the next step.
   */
  async clickContinue() {
    await this.continueButton.click();
  }

  /**
   * A method to open the payment page directly, if needed for a specific test.
   */
  async open() {
    await super.open("payment");
  }
}

export default new PaymentPage();
