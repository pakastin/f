
import { text, mount } from './index';

export function el (tagName, attrs) {
  var element = document.createElement(tagName);

  for (var i = 1; i < arguments.length; i++) {
    var arg = arguments[i];

    if (arg == null) {
      continue;
    }

    var isString = typeof arg === 'string';

    if ((i > 1) || isString || ((arg.el || arg) instanceof Node)) {
      if (isString) {
        mount(element, text(arg));
      } else {
        mount(element, arg);
      }
    } else if (i === 1) {
      for (var attr in arg) {
        if (element[attr] != null) {
          element[attr] = arg[attr];
        } else {
          element.setAttribute(attr, arg[attr]);
        }
      }
    }
  }

  return element;
}
