function contains(selector, regex) {
  const elements = document.querySelectorAll(selector);
  return [].filter.call(elements, el => {
    const text =
      el.childNodes.length > 0 ? el.childNodes[0].nodeValue : el.nodeValue;
    return regex.test(text);
  });
}

const priceTags = contains('span, div, p, td', /£\d+/);
const prices = priceTags.map(pt => pt.textContent.match(/£\d+\.\d+/)[0]);
const floatValues = prices.map(price => parseFloat(price.replace('£', '')));
browser.storage.local.get().then(data => {
  const pounds = data.rates.GBP;
  const converted = floatValues.map(v => `~$${(v / pounds).toFixed(2)}`);
  priceTags.forEach(
    (pt, i) =>
      (pt.textContent = pt.textContent.replace(prices[i], converted[i]))
  );
});
