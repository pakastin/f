
import { mount } from './index';

export function svg (tagName, attrs) {
  var element = document.createElementNS('http://www.w3.org/2000/svg', tagName);

  for (var attr in attrs) {
    element.setAttribute(attr, attrs[attr]);
  }

  for (var i = 2; i < arguments.length; i++) {
    mount(element, arguments[i]);
  }

  return element;
}
