
import { mount, unmount, setChildren } from './index';

export function list (View, key, initData) {
  return new List(View, key, initData);
}

export function List (View, key, initData) {
  this.View = View;
  this.key = key;
  this.lookup = key != null ? {} : [];
  this.views = [];
  this.initData = initData;
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
    var view = lookup[id] || new View(this.initData);

    view.update && view.update(item);
    views[i] = view;

    newLookup[id] = view;
  }

  for (var id in lookup) {
    if (!newLookup[id]) {
      if (lookup[id].remove) {
        lookup[id].el.removing = true;
        scheduleRemove(this.parent, lookup[id]);
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

  this.lookup = newLookup;
}

function scheduleRemove (parent, child) {
  child.remove(function () {
    unmount(parent, child);
  });
}
