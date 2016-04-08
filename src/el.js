
import { text, mount } from './index';

export function el (tagName) {
  var element = document.createElement(tagName);

  for (var i = 1; i < arguments.length; i++) {
    var arg = arguments[i];

    if (i === 1 && typeof arg === 'object') {
      for (var attr in arg) {
        if (element[attr] != null) {
          element[attr] = arg[attr];
        } else {
          element.setAttribute(attr, arg[attr]);
        }
      }
      continue;
    }

    if (typeof arg === 'string') {
      mount(element, text(arg));
    } else {
      mount(element, arg);
    }
  }

  return element;
}
