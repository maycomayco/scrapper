/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
const { chromium } = require("playwright");

const sites = [
  {
    name: "Hiper Libertad",
    url: "https://www.hiperlibertad.com.ar/busca?ft=yerba%20playadito",
    productsView: {
      listItem: '[class*="styles__ProductItem"]',
      title: '[class*="styles__Title-"]',
      price: '[class*="styles__BestPrice"]',
    },
  },
  {
    name: "Super mami",
    url: "https://www.dinoonline.com.ar/super/categoria?Ntt=yerba+playadito",
    productsView: {
      listItem: ".item",
      title: ".description",
      price: ".precio-unidad span",
    },
  },
  {
    name: "Disco",
    url: "https://www.disco.com.ar/yerba%20playadito?_q=yerba%20playadito&map=ft",
    productsView: {
      listItem: "#gallery-layout-container > div > section > a > article",
      title:
        "#gallery-layout-container > div > section > a > article > .vtex-product-summary-2-x-nameContainer > h2 > span",
      price:
        "#gallery-layout-container > div > section > a > article > .vtex-flex-layout-0-x-flexRow--mainRow-price-box > div > div > div > div > div > div > div > div > span",
    },
  },
  {
    name: "Chango mas",
    url: "https://www.masonline.com.ar/yerba%20playadito?_q=yerba%20playadito&map=ft",
    productsView: {
      listItem: ".vtex-search-result-3-x-gallery > div > section",
      title: ".vtex-product-summary-2-x-nameContainer > h3 > span",
      price: ".vtex-store-components-3-x-priceContainer > div > span > span",
    },
  },
];

/*
  Remove $ and , from the HTML price
  TODO: make it work with regex
*/
function formatPrice(price) {
  let sanitizedPrice = price.replace("$", "");
  sanitizedPrice = sanitizedPrice.replace(",", ".");

  return sanitizedPrice;
}

// Siempre utilizamos await para poder esperar a que la promesa contra el navegador se resuelva
(async () => {
  // instanciamos chromium
  // const browser = await chromium.launch({ headless: false });
  const browser = await chromium.launch();

  for (const site of sites) {
    // levantamos una nueva pagina
    const page = await browser.newPage();
    const { name, url, productsView } = site;
    console.log(`==> ${name.toUpperCase()}`);
    // nos dirigiemos a la pagina
    await page.goto(url);
    // esperamos a que el selector se cargue y este visible en la pagina
    await page.waitForSelector(productsView.listItem);
    // evaluamos codigo en la consola de la pagina, directamente en el navegador
    const productsText = await page.evaluate((productsSelectors) => {
      const { listItem, title, price } = productsSelectors;
      // almacenamos el texto de todos los products en un array para retornarlo
      const productsTextArray = [];
      // recolectamos la lista de nodos que contienen los productos
      const products = document.querySelectorAll(listItem);
      products.forEach((product) => {
        const productObject = {
          name: product.querySelector(title).innerText,
          price: product.querySelector(price).innerText,
        };
        productsTextArray.push(productObject);
      });

      return productsTextArray;
    }, productsView);

    await page.close();

    const results = productsText
      .map((p) => ({ ...p, price: formatPrice(p.price) }))
      .sort((a, b) => a.price - b.price);

    console.log(results);
    console.log("===========================================================");
  }
  // end of execution
  // await page.close();
  await browser.close();
})();
