
var f = require('./f');
var test = require('tape');

test('element creation', function (t) {
  t.plan(1);

  var hello = f.el('p', { textContent: 'Hello world!' });

  t.equals(hello.outerHTML, '<p>Hello world!</p>');
});

test('element with custom attribute', function (t) {
  t.plan(1);

  var hello = f.el('p', { textContent: 'Hello world!', custom: 'a' });

  t.equals(hello.outerHTML, '<p custom="a">Hello world!</p>');
});

test('element mounting', function (t) {
  t.plan(1);

  var hello = f.el('p', { textContent: 'Hello world!' });
  f.setChildren(document.body, [hello]);

  t.equals(document.body.innerHTML, '<p>Hello world!</p>');
});

test('element mounting with children', function (t) {
  t.plan(1);

  var hello = f.el('p', { textContent: 'Hello world!' });
  var hello2 = f.el('p', { textContent: "What's up?" });
  var div = f.el('div', null, hello, hello2);

  f.setChildren(document.body, [div]);

  t.equals(document.body.innerHTML, "<div><p>Hello world!</p><p>What's up?</p></div>");
});

test('svg creation', function (t) {
  t.plan(1);

  var circle = f.svg('circle', { cx: 0, cy: 0, r: 10 });
  var line = f.svg('line', { x1: 0, y1: 0, x2: 10, y2: 0 });
  var svg = f.svg('svg', { width: 100, height: 100 }, circle, line);

  f.setChildren(document.body, [svg]);

  t.equals(document.body.innerHTML, '<svg width="100" height="100"><circle cx="0" cy="0" r="10"></circle><line x1="0" y1="0" x2="10" y2="0"></line></svg>');
});

test('list creation', function (t) {
  t.plan(1);

  var Item = function (initData, data) {
    this.el = f.el('p');
    this.el.textContent = data;
  }

  var list = f.list(Item);

  f.mount(document.body, list);

  list.update([1, 2, 3]);

  t.equals(document.body.innerHTML, '<p>1</p><p>2</p><p>3</p>');
});

test('list creation with key', function (t) {
  t.plan(1);

  var Item = function (initData, data) {
    this.el = f.el('p');
    this.el.textContent = data._id;
  }

  var list = f.list(Item, '_id');

  f.mount(document.body, list);

  list.update([
    { _id: 1 },
    { _id: 2 },
    { _id: 3 }
  ]);

  t.equals(document.body.innerHTML, '<p>1</p><p>2</p><p>3</p>');
});

test('list update', function (t) {
  t.plan(2);

  var called = {};

  var Item = function (initData) {
    this.el = f.el('p');
  }
  Item.prototype.update = function (data) {
    this.el.textContent = data;
  }
  Item.prototype.updated = function () {
    called.updated = true;
  }

  var list = f.list(Item);

  f.mount(document.body, list);

  list.update([ 5, 4, 6 ]);

  list.update([ 3, 1 ]);

  list.update([ 1, 2, 3 ]);

  t.equals(document.body.innerHTML, '<p>1</p><p>2</p><p>3</p>');
  t.ok(called.updated, 'called "updated"');
});

test('list update with key', function (t) {
  t.plan(6);

  var called = {};

  var Item = function (initData, data) {
    this.el = f.el('p');
    this.el.textContent = data._id;
  }

  Item.prototype.remove = function (next) {
    called.remove = true;
    next();
  }

  Item.prototype.reorder = function () {
    called.reorder = true;
  }

  var list = f.list(Item, '_id');

  f.mount(document.body, list);

  list.update([
    { _id: 2 },
    { _id: 4 },
    { _id: 3 }
  ]);

  list.update([
    { _id: 4 },
    { _id: 2 }
  ]);

  list.update([
    { _id: 1 },
    { _id: 2 },
    { _id: 3 }
  ], function (ops) {
    t.equals(ops.added.length, 2, 'added count');
    t.equals(ops.updated.length, 1, 'updated count');
    t.equals(ops.removed.length, 1, 'removed count');
  });

  t.equals(document.body.innerHTML, '<p>1</p><p>2</p><p>3</p>');
  t.ok(called.reorder, 'called "reorder"');
  t.ok(called.remove, 'called "remove"');
});

test('special cases', function (t) {
  t.plan(4);

  var Item = function () {
    this.el = f.el('p', { textContent: 'Hello world!' });
  }
  Item.prototype.mount = function () {
    t.pass();
  }
  Item.prototype.reorder = function () {
    t.pass();
  }
  Item.prototype.unmount = function () {
    t.pass();
  }

  var item = new Item();

  f.mountBefore(document.body, item, document.body.firstChild);
  f.mount(document.body, item);
  f.unmount(document.body, item);
  f.mount(document.body, item);
  f.unmount(document.body, item.el);
});
