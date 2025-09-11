export default class Page {
  async open(path) {
    await browser.url(`http://localhost:3000/${path}`);
  }
}
