import React, { PureComponent } from 'react'
import ModelViewer from 'metamask-logo'
import cx from 'classnames'
import styles from './Logo.css'

export default class Logo extends PureComponent {

  static defaultProps = {
    animated: true,
  }

  constructor(props) {
    super(props)
    this.ref = React.createRef()
  }

  componentDidMount() {
    const { animated } = this.props

    if (!animated) {
      return
    }

    var fox = ModelViewer({
      pxNotRatio: true,
      width: 47,
      height: 47,
      followMouse: true,
    })

    // add fox to DOM
    this.ref.current.appendChild(fox.container)
  }

  render() {
    const { className, animated } = this.props
    if (animated) {
      return <span ref={this.ref} className={className} ></span>
    } else {
      return <span className={cx(className, styles.fox)} ></span>
    }
  }
}