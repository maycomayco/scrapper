/* eslint-disable import/no-extraneous-dependencies */
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://clasificados.lavoz.com.ar/inmuebles/departamentos/2-dormitorios?cantidad-de-dormitorios[0]=2-dormitorios&operacion=alquileres&barrio=general-paz');

  const props = await (await page.$('div.col.col-9.px2 div.flex.flex-wrap')).innerHTML();
  console.log(props);
  // end of execution
  await browser.close();
})();
