
import { mount, unmount, setChildren } from './index';

export function list (View, key, options) {
  return new List(View, key, options);
}

export function List (View, key, options) {
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

  this.onupdated && this.onupdated(views);

  this.lookup = newLookup;
}

function scheduleRemove (parent, child) {
  child.remove(function () {
    unmount(parent, child);
  });
}
