import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// jsdom ainda não implementa <dialog>.showModal()/close()
HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
  this.setAttribute('open', '')
}
HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
  this.removeAttribute('open')
}

afterEach(() => {
  cleanup()
  localStorage.clear()
})
