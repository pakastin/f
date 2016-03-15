
import { mount, mountBefore } from './index';

export function setChildren (parent, children) {
  var traverse = (parent.el || parent).firstChild;

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
      (parent.el || parent).removeChild(traverse);
    }
    traverse = next;
  }
}
