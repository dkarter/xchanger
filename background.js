Date.prototype.withoutTime = function() {
  let d = new Date(this);
  d.setHours(0, 0, 0, 0);
  return d;
};

function getRates() {
  return browser.storage.local.get().then(data => {
    const date = new Date(data.dateFetched || null).withoutTime();
    const today = new Date().withoutTime();

    if (date < today) {
      return loadRates();
    } else {
      return data;
    }
  });
}

function loadRates() {
  return fetch('https://api.fixer.io/latest?base=USD').then(resp => {
    return resp.json().then(json => {
      return browser.storage.local
        .set({ ...json, dateFetched: new Date() })
        .then(_ => {
          return json;
        });
    });
  });
}

function convertCurrencies() {
  getRates().then(({ rates }) => {
    browser.tabs.executeScript({ file: 'xchanger.js' });
  });
}

browser.browserAction.onClicked.addListener(convertCurrencies);
