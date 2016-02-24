
export function mount (parent, child) {
  if (child.el) {
    (parent.el || parent).appendChild(child.el);
    child.mount && child.mount();
  } else {
    (parent.el || parent).appendChild(child);
  }
}

export function mountBefore (parent, child, before) {
  if (child.el) {
    (parent.el || parent).insertBefore(child.el, before.el || before);
    child.mount && child.mount();
  } else {
    (parent.el || parent).insertBefore(child, before.el || before);
  }
}

export function unmount (parent, child) {
  if (child.el) {
    (parent.el || parent).removeChild(child.el);
    child.unmount && child.unmount();
  } else {
    (parent.el || parent).removeChild(child);
  }
}
