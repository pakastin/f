
import { unmount, setChildren } from './index';

export function list (View, key) {
  return new List(View, key);
}

export function List (View, key) {
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
