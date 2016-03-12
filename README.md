# f
This will probably eventually replace [FRZR](https://frzr.js.org), but for now it's a separate project.

## f.el(tagName, attributes, children...)
Creates a HTML element:
```js
var p = f.el('p', { textContent: 'Hello world!' });
```
You can also define children:
```js
var div = f.el('div', null, p);
```

## f.svg(tagName, attributes, children...)
Works like f.el, but creates a SVG element:
```js
var circle = f.el('circle', { cx: 50, cy: 50, r: 50 });
var svg = f.el('svg', { width: 100, height: 100 }, circle);
```

## Creating components
Components are just POJF (plain old JavaScript functions):
```js
function Item () {
  this.el = f.el('p');
}
Item.prototype.update = function (text) {
  this.el.textContent = text;
}
var item = new Item();
item.update('Hello world!');
f.mount(document.body, item); // <body><p>Hello world!</p></body>
```

## Creating lists:
Above example makes a lot more sense now:
```js
var list = f.list(Item);
f.mount(document.body, list);
list.update([1, 2, 3]); // <body><p>1</p><p>2</p><p>3</p></body>
list.update([2, 3, 4, 5]); // <body><p>2</p><p>3</p><p>4</p><p>5</p></body>
```
You can delay removing the elements by defining a `remove`-method to a component:
```js
Item.prototype.remove = function (doRemove) {
  setTimeout(doRemove, 1000); // remove after 1 second
}
```
## f.mount(target, child)
You can mount HTML elements/components to HTML elements/components.
```js
f.mount(document.body, p);
f.mount(document.body, div);
f.mount(div, p);
```
If a component gets mounted, Component.mount/Component.reorder gets called, if present:
```js
Item.prototype.mount = function () {
  console.log('mounted');
}
Item.prototype.reorder = function () {
  // was already in the DOM when asked to mount
  console.log('reordered');
}
```
## f.mountBefore(target, child, before)
```js
f.mountBefore(document.body, svg, div);
```
## f.unmount(target, child)
Unmounts element/component from element/component. Component.unmount gets called, if present: 
```js
Item.prototype.unmount = function () {
  console.log('unmounted');
}
```

## f.setChildren(target, [child])
This cleverly replaces target's children. Children already in the DOM automatically gets moved / kept in place.
```js
f.setChildren(document.body, [p, svg]);
```
