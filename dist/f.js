(function (exports) {
  'use strict';

  function el (tagName, attrs) {
    var element = document.createElement(tagName);

    for (var attr in attrs) {
      element[attr] = attrs[attr];
    }

    for (var i = 2; i < arguments.length; i++) {
      mount(element, arguments[i]);
    }

    return element;
  }

  function list (View, key) {
    return new List(View, key);
  }

  function List (View, key) {
    this.View = View;
    this.key = key;
    this.lookup = key != null ? {} : [];
  }

  List.prototype.update = function (parent, data) {
    var View = this.View;
    var key = this.key;
    var lookup = this.lookup;
    var newLookup = {};
    var views = new Array(data.length);

    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      var id = key != null ? item[key] : i;
      var view = lookup[id] || new View(item);

      views[i] = view;

      newLookup[id] = view;
      view.update && view.update(item);
    }

    for (var id in lookup) {
      if (!newLookup[id]) {
        if (lookup[id].remove) {
          lookup[id].el.removing = true;
          lookup[id].remove(function () {
            unmount(parent, lookup[id]);
          });
        } else {
          unmount(parent, lookup[id]);
        }
      }
    }

    setChildren(parent, views);

    for (var i = 0; i < data.length; i++) {
      view.updated && views[i].updated(data[i]);
    }

    this.lookup = newLookup;
  }

  function mount (parent, child) {
    if (child.el) {
      (parent.el || parent).appendChild(child.el);
      child.mount && child.mount();
    } else {
      (parent.el || parent).appendChild(child);
    }
  }

  function mountBefore (parent, child, before) {
    if (child.el) {
      (parent.el || parent).insertBefore(child.el, before.el || before);
      child.mount && child.mount();
    } else {
      (parent.el || parent).insertBefore(child, before.el || before);
    }
  }

  function unmount (parent, child) {
    if (child.el) {
      (parent.el || parent).removeChild(child.el);
      child.unmount && child.unmount();
    } else {
      (parent.el || parent).removeChild(child);
    }
  }

  function setChildren (parent, children) {
    var traverse = parent.firstChild;

    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      var el = child.el || child;

      if (el === traverse) {
        traverse = traverse.nextSibling;
        continue;
      }
      if (traverse) {
        mountBefore(parent, child, traverse);
      } else {
        mount(parent, child);
      }
    }
    while (traverse) {
      var next = traverse.nextSibling;
      if (!traverse.removing) {
        parent.removeChild(traverse);
      }
      traverse = next;
    }
  }

  exports.el = el;
  exports.list = list;
  exports.List = List;
  exports.mount = mount;
  exports.mountBefore = mountBefore;
  exports.unmount = unmount;
  exports.setChildren = setChildren;

}((this.f = this.f || {})));