
import { text, mount } from './index';

export function svg (tagName) {
  var element = document.createElementNS('http://www.w3.org/2000/svg', tagName);

  for (var i = 1; i < arguments.length; i++) {
    var arg = arguments[i];

    if (arg == null) {
      continue;
    }

    if (i > 1 || typeof arg === 'string' || ((arg.el || arg) instanceof Node)) {
      if (typeof arg === 'string') {
        mount(element, text(arg));
      } else {
        mount(element, arg);
      }
    } else if (i === 1) {
      for (var attr in arg) {
        element.setAttribute(attr, arg[attr]);
      }
    }
  }

  return element;
}
