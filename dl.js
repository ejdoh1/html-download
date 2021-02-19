const Nightmare = require("nightmare");
const nightmare = Nightmare({ show: true });
const fs = require("fs");

const args = process.argv.slice(2);

nightmare
  .goto(args[0])
  .wait("x", parseInt(args[2]))
  .evaluate(() => {
    const getShadowDomHtml = (shadowRoot) => {
      let shadowHTML = "";
      for (let el of shadowRoot.childNodes) {
        shadowHTML += el.nodeValue || el.outerHTML;
      }
      return shadowHTML;
    };

    const replaceShadowDomsWithHtml = (rootElement) => {
      for (let el of rootElement.querySelectorAll("*")) {
        if (el.shadowRoot) {
          replaceShadowDomsWithHtml(el.shadowRoot);
          el.innerHTML += getShadowDomHtml(el.shadowRoot);
        }
      }
    };

    replaceShadowDomsWithHtml(document.body);
    return document.documentElement.outerHTML;
  })
  .end()
  .then((d) => fs.writeFileSync(args[1], d))
  .catch((error) => {
    console.error(error);
  });
