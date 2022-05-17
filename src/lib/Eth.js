import Web3 from 'web3'

class ETH {
  constructor() {
    // https://github.com/MetaMask/faq/blob/master/detecting_metamask.md#web3-deprecation

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      // Use the browser's ethereum provider
      this.web3 = new Web3(window.web3.currentProvider)
    } else {
      this.web3 = null
    }
  }

  isAvailable() {
    return this.web3 !== null
  }

  isLogged() {
    return this.getUserAccounts()
      .then((accounts) => Boolean(accounts.length))
  }

  getUserAccounts() {
    return this.web3.eth.getAccounts()
  }

  getUserAccountAddress() {
    return this.getUserAccounts()
      .then((accounts) => accounts.length && accounts[0])
  }

  sendTransaction(valueEth, from, to) {
    return new Promise((resolve, reject) => {
      const value = this.web3.utils.toWei(valueEth.toString(), 'ether')
      this.web3.eth.sendTransaction({
        from,
        to,
        value,
      }, (err, transactionHash) => {
        if (err) {
          reject(err)
          return
        }
        resolve(transactionHash)
      })
    })
  }

  sendTransactionFromUser(value, to) {
    return this.getUserAccountAddress()
      .then(from =>
        this.sendTransaction(value, from, to)
      )
  }
}

export default new ETH()