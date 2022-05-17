import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { convertFromEthToFiat, convertToEth, formatToFiatCurrency, formatCryptocurrency } from '../../lib/format'
import Logo from '../../components/Logo/Logo'
import eth from '../../lib/Eth'
import styles from './Button.css'

const STATUS = {
  INITIAL: 'initial',
  NOT_LOGGED: 'not-logged',
  ERROR: 'error',
  SUCCESS: 'success',
  LOADING: 'loading',
  MISSING_METAMASK: 'missing-metamask',
}

const SYMBOLS = {
  USD: 'USD',
  ETH: 'ETH',
}

export default class Button extends Component {

  static propTypes = {
    address: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    text: PropTypes.string,
    logoAnimated: PropTypes.bool,
    amountCurrency: PropTypes.string,
    successCallback: PropTypes.string,
    errorCallback: PropTypes.string,
  }

  static defaultProps = {
    text: 'Donate',
    address: null,
    amount: null,
    currency: SYMBOLS.ETH,
    amountCurrency: SYMBOLS.ETH,
    logoAnimated: true,
    successText: 'Thank you!',
    fiatFirst: false,
    fiatCurrency: null,
  }

  state = {
    status: STATUS.INITIAL,
    amountEth: null,
    amountFiat: null,
    amount: 1,
    fiat: SYMBOLS.USD,
  }

  componentDidMount() {
    this.setAmounts()
  }

  setAmounts() {
    const { address, amount, amountCurrency, fiatCurrency } = this.props

    if (address === null || amount === null) {
      return this.onError(new Error('Properties address or amount missing.'))
    }

    if (amountCurrency === SYMBOLS.ETH) { // We convert from ETH to FIAT

      /*
       * When fiatCurrency is undefined, it means that the user already entered an amount in fiat
       * so we do not need to convert and returns null
       */
      const getAmountFiat = fiatCurrency ?
        convertFromEthToFiat(amount, fiatCurrency) :
        Promise.resolve(null)

      return getAmountFiat
        .then(amountFiat => {
          this.setState({
            amountEth: amount,
            ...(amountFiat && { amountFiat, fiat: fiatCurrency }),
          })
        })

    } else { // We convert from FIAT to ETH
      convertToEth(amount, amountCurrency)
        .then(amountEth =>
          this.setState({
            amountEth,
            amountFiat: amount,
            fiat: amountCurrency,
          })
        )
    }
  }

  handleClick = () => {
    if (!eth.isAvailable()) {
      this.setState({ status: STATUS.MISSING_METAMASK })
      window.open('https://metamask.io')
      return
    }

    eth.isLogged().then(isLogged => {
      if (!isLogged) {
        this.setState({ status: STATUS.NOT_LOGGED })
        throw new Error('not logged')
      }
      this.setState({ status: STATUS.LOADING })
      return eth.sendTransactionFromUser(this.state.amountEth, this.props.address)
        .then(this.onSuccess)
        .catch((e) => {
          // Display error during 3s than back to idle state
          this.setState({ status: STATUS.ERROR })
          setTimeout(() => this.setState({ status: STATUS.INITIAL }), 3000)
          throw e // continue to onError
        })
    })
    .catch(this.onError)
  }

  onSuccess = (transactionHash) => {
    const { successCallback } = this.props
    this.setState({ status: STATUS.SUCCESS })
    // Call success callback
    if (successCallback && typeof window[successCallback] !== 'undefined') {
      window[successCallback](transactionHash)
    }
  }

  onError = (e) => {
    console.error(e)
    const { errorCallback } = this.props

    // Call error callback
    if (errorCallback && typeof window[errorCallback] !== 'undefined') {
      window[errorCallback](e)
    }
  }

  render() {
    const { amountEth } = this.state
    if (amountEth === null) {
      return null
    }
    const { logoAnimated } = this.props
    return (
      <button onClick={this.handleClick} className={styles.button} >
        <Logo
          className={styles.logo}
          animated={logoAnimated}
        />
        {this.renderInitial()}
        {this.renderNotLogged()}
        {this.renderMissing()}
        {this.renderError()}
        {this.renderLoading()}
        {this.renderSuccess()}
      </button>
    )
  }

  renderNotLogged = () => {
    const { status } = this.state
    return (
      status === STATUS.NOT_LOGGED ?
       <span className={styles.status} >You must login<br/>to metamask first.</span>
      : null
    )
  }

  renderMissing = () => {
    const { status } = this.state
    return (
      status === STATUS.MISSING_METAMASK ?
       <span className={styles.status} >You need metamask!<br/>https://metamask.io</span>
      : null
    )
  }

  renderError = () => {
    const { status } = this.state
    return (
      status === STATUS.ERROR ?
        <span className={styles.status} >Transaction<br/>not confirmed.</span>
      : null
    )
  }

  renderInitial = () => {
    const { text, fiatFirst } = this.props
    const { status, amountEth, amountFiat, fiat } = this.state

    const amountEthFormatted = (
      <Fragment>
        {formatCryptocurrency(amountEth)}
        <span className={styles.symbolEthLogo}>Ξ</span>
        <span className={styles.symbolEth}>{SYMBOLS.ETH}</span>
      </Fragment>
    )
    const amountFiatFormatted = amountFiat && formatToFiatCurrency(amountFiat, fiat)

    const amountBig = fiatFirst ? amountFiatFormatted : amountEthFormatted
    const amountSmall = fiatFirst ? amountEthFormatted : amountFiatFormatted

    return (
      status === STATUS.INITIAL ?
        <Fragment>
          <span className={styles.text}>
            {text}
            <span className={styles.withMetamask} >via metamask</span>
          </span>
          <span className={styles.amounts}>
            <span className={styles.amountBig}>{amountBig}</span>
            {amountFiatFormatted &&
              <span className={styles.conversion}>
                <span className={styles.approx}>≈</span>
                <span className={styles.amountSmall}>{amountSmall}</span>
              </span>
            }
          </span>
        </Fragment>
      : null
    )
  }

  renderLoading = () => {
    const { status } = this.state
    return (
      status === STATUS.LOADING ?
        <span className={styles.status}>Waiting for<br/>confirmation...</span>
      : null
    )
  }

  renderSuccess = () => {
    const { successText } = this.props
    const { status } = this.state
    return (
      status === STATUS.SUCCESS ?
        <span className={styles.status}>{successText}</span>
      : null
    )
  }

}