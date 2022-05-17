## Metamask Transaction button

![gif](https://d3vv6lp55qjaqc.cloudfront.net/items/3o2C1n3B460X1G2n3r1e/Screen%20Recording%202018-04-25%20at%2001.56%20AM.gif?v=e6c35374)

### Usage

**Step1:** Include the JavaScript script on your page ONCE, ideally right before the ending body tag.
```html
<script src="https://cdn.rawgit.com/pierregoutheraud/metamask-transaction-button/6ebebf41/build/static/js/mtb.js"></script>
```

**Step2:** Place this code wherever you want a button to appear on your page.
```html
<div
  class="metamask-button"
  address="0x2b7dF997E54CD20a9fFa5AC460D0A9FBD5fB0c09"
  amount="0.005"
  success-callback="onSuccess"
  error-callback="onError"
></div>
```

### Examples

#### Example 1: Amount in ETH with no conversion in fiat currency.
![Example 1](https://d3vv6lp55qjaqc.cloudfront.net/items/422t2p030C152q0w103j/Image%202018-04-24%20at%204.37.36%20PM.png?v=7b3aeba7)
```html
<div
  class="metamask-button"
  address="0x2b7dF997E54CD20a9fFa5AC460D0A9FBD5fB0c09"
  amount="0.005"
></div>
```

---
#### Example 2: Amount in ETH with conversion in fiat currency.
![Example 2](https://d3vv6lp55qjaqc.cloudfront.net/items/3f3V1S0j0p3z140w3O3W/Image%202018-04-24%20at%204.30.30%20PM.png?v=8577379d)
```html
<div
  class="metamask-button"
  address="0x2b7dF997E54CD20a9fFa5AC460D0A9FBD5fB0c09"
  amount="0.005"
  amount-currency="ETH"
  fiat-currency="USD"
  text="Pay"
  logo-animated="false"
></div>
```
---
#### Example 3: Amount in fiat currency with conversion in ETH.

![Example 3](https://d3vv6lp55qjaqc.cloudfront.net/items/2l1e2c2u3Y222f191G3V/Image%202018-04-24%20at%204.33.05%20PM.png?v=df8997c3)

```html
<div
  class="metamask-button"
  address="0x1f2b10EbC8783d2851B96CdA086E6e6a021E6b4B"
  text="Donate"
  amount="5"
  amount-currency="EUR"
  fiat-first="true"
></div>
```
---
#### Example 4: Success and Error callback

```html
<div
  class="metamask-button"
  address="0x1f2b10EbC8783d2851B96CdA086E6e6a021E6b4B"
  amount="5"
  success-callback="onSuccess"
  error-callback="onError"
></div>

<script>
  window.onSuccess = (transactionHash) => {
    console.log('Success', transactionHash)
  }
  window.onError = (e) => {
    console.error('Error', e)
  }
</script>
```

### Properties

Since the properties are passed in html attributes, they are all of type string.

| Property | Type | Default | Possible values | Description |
|:---|:---|:---|:---|:---|
| address | Required | `undefined` | Any valid ETH wallet address. | The recipient ETH wallet address.
| amount | Required | `undefined` | Any float or integer numbers. Examples: `0.00492`, `12.4`, `20` | The amount to send in the transaction.
| text | Optional | `Donate` | Any text. | The text to display in the button.
| success-text | Optional | `Thank you!` | Any text. | Text to display when transaction is finished.
| amount-currency | Optional | `ETH` | `ETH`<br/> `AUD`<br/> `BRL`<br/> `CAD`<br/>`CHF`<br/> `CLP`<br/> `CNY`<br/> `CZK`<br/>`DKK`<br/> `EUR`<br/> `GBP`<br/> `HKD`<br/>`HUF`<br/> `IDR`<br/> `ILS`<br/> `INR`<br/>`JPY`<br/> `KRW`<br/> `MXN`<br/> `MYR`<br/>`NOK`<br/> `NZD`<br/> `PHP`<br/> `PKR`<br/>`PLN`<br/> `RUB`<br/> `SEK`<br/> `SGD`<br/>`THB`<br/> `TRY`<br/> `TWD`<br/> `ZAR` | The currency of the amount. If this is different from `ETH` (Example: `USD`) than the button will convert the amount into ETH.
| fiat-currency | Optional | `undefined` | `AUD`<br/> `BRL`<br/> `CAD`<br/>`CHF`<br/> `CLP`<br/> `CNY`<br/> `CZK`<br/>`DKK`<br/> `EUR`<br/> `GBP`<br/> `HKD`<br/>`HUF`<br/> `IDR`<br/> `ILS`<br/> `INR`<br/>`JPY`<br/> `KRW`<br/> `MXN`<br/> `MYR`<br/>`NOK`<br/> `NZD`<br/> `PHP`<br/> `PKR`<br/>`PLN`<br/> `RUB`<br/> `SEK`<br/> `SGD`<br/>`THB`<br/> `TRY`<br/> `TWD`<br/> `ZAR`  | Only works if your amount-currency is `ETH`. `fiat-currency` is the fiat currency (Example: `USD`, `EUR`...) used to display a converted amount.
| fiat-first | Optional | `false` | `true` or `false` | If `amount-currency` is different from `ETH` than it displays the big amount in `amount-currency`, the small amount will be displayed in `ETH`
| logo-animated | Optional | `false` | `true` or `false` | Boolean to animate the logo.
| success-callback | Optional | `undefined` | Any function defined in window. Example: `onSuccess` | The callback function to be called when transaction finished without errors.
| error-callback | Optional | `undefined` | Any function defined in window. Example: `onError` | The callback function to be called when an error occured during the transaction.
