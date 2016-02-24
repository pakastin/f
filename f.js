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

  function list (View, key, options) {
    return new List(View, key, options);
  }

  function List (View, key, options) {
    this.View = View;
    this.key = key;
    this.lookup = key != null ? {} : [];
    this.views = [];

    if (options) {
      this.onupdate = options.update;
      this.onupdated = options.updated;
    }
  }

  List.prototype.update = function (data) {
    var View = this.View;
    var key = this.key;
    var lookup = this.lookup;
    var newLookup = {};
    var views = this.views = new Array(data.length);

    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      var id = key != null ? item[key] : i;
      var view = lookup[id] || new View(item);
      view.update && view.update(item);
      views[i] = view;

      newLookup[id] = view;
    }

    this.onupdate && this.onupdate(views);

    for (var id in lookup) {
      if (!newLookup[id]) {
        if (lookup[id].remove) {
          lookup[id].el.removing = true;
          scheduleRemove(parent, lookup[id]);
        } else {
          this.parent && unmount(this.parent, lookup[id]);
        }
      }
    }

    if (this.parent) {
      setChildren(this.parent, views);
    }

    for (var i = 0; i < views.length; i++) {
      var item = data[i];
      var view = views[i];

      view.updated && view.updated(item);
    }

    this.onupdated && this.onupdated(views);

    this.lookup = newLookup;
  }

  function scheduleRemove (parent, child) {
    this.parent && child.remove(function () {
      unmount(parent, child);
    });
  }

  function mount (parent, child) {
    if (child instanceof List) {
      child.parent = parent;
      setChildren(parent, child.views);
      return;
    }
    if (child.el) {
      (parent.el || parent).appendChild(child.el);
      if (child.parent) {
        child.reorder && child.reorder();
      } else {
        child.mount && child.mount();
      }
      child.parent = parent;
    } else {
      (parent.el || parent).appendChild(child);
    }
  }

  function mountBefore (parent, child, before) {
    if (child.el) {
      (parent.el || parent).insertBefore(child.el, before.el || before);
      if (child.parent) {
        child.reorder && child.reorder();
      } else {
        child.mount && child.mount();
      }
      child.parent = parent;
    } else {
      (parent.el || parent).insertBefore(child, before.el || before);
    }
  }

  function unmount (parent, child) {
    if (child.el) {
      (parent.el || parent).removeChild(child.el);
      child.parent = null;
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