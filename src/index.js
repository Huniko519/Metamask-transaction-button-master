import React from 'react'
import ReactDOM from 'react-dom'
import '!style-loader!css-loader!./index.css' // eslint-disable-line import/no-webpack-loader-syntax
import Button from './components/Button/Button'

function parseValue(name, value) {
  if (value === 'true') return true
  if (value === 'false') return false
  if (name !== 'address' && !isNaN(value)) return parseFloat(value)
  return value
}

function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
}

const className = 'metamask-button'
const buttons = document.querySelectorAll(`div.${className}`)
buttons.forEach(button => {
  // Get all html attributes and pass them as props to Button Component
  const props = Array.from(button.attributes).reduce((acc, curr) => {
    const { name, value } = curr
    const parsedName = toCamelCase(name)
    const parsedValue = parseValue(name, value)
    acc[parsedName] = parsedValue
    return acc
  }, {})
  ReactDOM.render(<Button {...props} />, button)
})

