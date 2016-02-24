
import { setChildren, List } from './index';

export function mount (parent, child) {
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

export function mountBefore (parent, child, before) {
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

export function unmount (parent, child) {
  if (child.el) {
    (parent.el || parent).removeChild(child.el);
    child.parent = null;
    child.unmount && child.unmount();
  } else {
    (parent.el || parent).removeChild(child);
  }
}
