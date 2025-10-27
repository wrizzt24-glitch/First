import '@testing-library/jest-dom'

if (!window.alert) {
  window.alert = () => undefined
}

if (!window.confirm) {
  window.confirm = () => true
}
