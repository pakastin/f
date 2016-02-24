
export function el (tagName, attrs) {
  var element = document.createElement(tagName);

  for (var attr in attrs) {
    element[attr] = attrs[attr];
  }

  for (var i = 2; i < arguments.length; i++) {
    element.appendChild(arguments[i]);
  }

  return element;
}
