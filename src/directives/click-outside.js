export default {
  bind (el, binding, vnode) {
    const callback = binding.value;
    el.clickOutsideEvent = event => {
      if (!(el == event.target || el.contains(event.target))) {
        return callback.call(vnode.context, event)
      }
    }
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind (el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  }
}
