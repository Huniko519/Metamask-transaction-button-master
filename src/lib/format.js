function getBrowserLanguage() {
  return navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language
}

const LANGUAGE = process.env.NODE_ENV === 'development' ? 'en-US' : getBrowserLanguage

function isInt(n) {
  return n % 1 === 0;
}

// Get price of 1 token of crypto to price in fiat
export function getCryptoPriceIn(cryptoId, fiatSymbol) {
  return window.fetch(`https://api.coinmarketcap.com/v1/ticker/${cryptoId}/?convert=${fiatSymbol}`)
    .then(res => res.json())
    .then(data => data[0])
    .then(data => {
      return data[`price_${fiatSymbol.toLowerCase()}`]
    })
}

export function convertFromEthToFiat(amount, fiatSymbol="USD") {
  return getCryptoPriceIn('ethereum', fiatSymbol)
    .then(price => {
      const result = amount*price
      return result
    })
}

export function convertToEth(amount, fiatSymbol="USD") {
  return getCryptoPriceIn('ethereum', fiatSymbol)
    .then(price => {
      const result = amount/price
      return result
    })
}

export function formatToFiatCurrency(value, fiatCurrency) {
  let minimumFractionDigits = null
  let maximumFractionDigits = null
  let minimumSignificantDigits = null
  let maximumSignificantDigits = null

  if (isInt(value)) {
    maximumFractionDigits = 0
    minimumFractionDigits = 0
  }

  // if (value >= 1) {
  //   maximumFractionDigits = 2
  // } else {
  //   maximumSignificantDigits = 4
  // }

  // Format value
  const options = {
    style: 'currency',
    currency: fiatCurrency,
    currencyDisplay: 'symbol',
    ...(maximumFractionDigits !== null && { maximumFractionDigits }),
    ...(minimumFractionDigits !== null && { minimumFractionDigits }),
    ...(maximumSignificantDigits !== null && { maximumSignificantDigits }),
    ...(minimumSignificantDigits != null && { minimumSignificantDigits }),
  }

  return new Intl.NumberFormat(LANGUAGE, options).format(value)
}

export function formatCryptocurrency(value) {
  let maximumFractionDigits = null
  let maximumSignificantDigits = null

  if (value >= 1) {
    maximumFractionDigits = 2
  } else {
    maximumSignificantDigits = 3
  }

  // Format value
  const options = {
    style: 'decimal',
    ...(maximumFractionDigits && { maximumFractionDigits }),
    ...(maximumSignificantDigits && { maximumSignificantDigits }),
  }
  return new Intl.NumberFormat(LANGUAGE, options).format(value)
}