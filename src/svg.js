
import { mount } from './index';

export function svg (tagName) {
  var element = document.createElementNS('http://www.w3.org/2000/svg', tagName);

  for (var i = 1; i < arguments.length; i++) {
    var arg = arguments[i];

    if (i === 1 && typeof arg === 'object') {
      for (var attr in arg) {
        element.setAttribute(attr, arg[attr]);
      }
      continue;
    }

    if (typeof arg === 'string') {
      mount(element, document.createTextNode(arg));
    } else {
      mount(element, arg);
    }
  }

  return element;
}
