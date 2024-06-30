import { store } from '@/state/store';
import { calcCaretPosition, getIconSidFromEvent } from './general';
import { copyNode, createNode, deleteNode, moveNode } from '@/state/rootSlice';
import { sh } from '@/state/shadowStore';

export function addEventListeners() {
  window.addEventListener('pointerdown', handlePointerDown);
  window.addEventListener('pointerup', handlePointerUp);
  window.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
}

export function removeEventListeners() {
  window.removeEventListener('pointerdown', handlePointerDown);
  window.removeEventListener('pointerup', handlePointerUp);
  window.removeEventListener('pointermove', handlePointerMove);
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
}

function handlePointerMove(e: PointerEvent) {
  calcCaretPosition(e);
}

function handlePointerDown(e: PointerEvent) {
  if (handleCaretPointerDown(e)) {
    return;
  }
  if (handleDeletePointerDown(e)) {
    return;
  }
  if (handleIconPointerDown(e)) {
    return;
  }
}

function handlePointerUp(e: PointerEvent) {
  handleCaretPointerUp(e);
  handleIconPointerUp();
}

function handleCaretPointerUp(e: PointerEvent): boolean {
  const caret = store.getState().caret;
  if (caret.visible && sh.selectedSid != null) {
    const structureModel = store.getState().structureModel;
    const node = structureModel[caret.sid];
    if (sh.pressedKeys.has('Alt')) {
      store.dispatch(
        copyNode({
          sid: caret.sid,
          pos: node.opened ? caret.pos : node.children.length,
          copySid: sh.selectedSid,
        })
      );
    } else {
      store.dispatch(
        moveNode({
          sidFrom: sh.selectedSid,
          sidParentTo: caret.sid,
          posTo: node.opened ? caret.pos : node.children.length,
        })
      );
    }
    calcCaretPosition(e);
    return true;
  }
  return false;
}

function handleIconPointerUp() {
  // todo - put this into handleCaretPointerUp
  if (sh.selectedSid != null) {
    sh.selectedSid = null;
    return true;
  }
  return false;
}

function handleIconPointerDown(e: PointerEvent) {
  const sid = getIconSidFromEvent(e);
  if (!sh.pressedKeys.has('Meta') && sid != null) {
    sh.selectedSid = sid;
    return true;
  }
  return false;
}

function handleCaretPointerDown(e: PointerEvent): boolean {
  const caret = store.getState().caret;
  if (caret.visible) {
    const structureModel = store.getState().structureModel;
    const node = structureModel[caret.sid];
    store.dispatch(
      createNode({
        sid: caret.sid,
        pos: node.opened ? caret.pos : node.children.length,
      })
    );
    calcCaretPosition(e);
    return true;
  }
  return false;
}

function handleDeletePointerDown(e: PointerEvent) {
  const sid = getIconSidFromEvent(e);
  if (sh.pressedKeys.has('Meta') && sid != null) {
    store.dispatch(deleteNode(sid));
    return true;
  }
  return false;
}

function handleKeyDown(e: KeyboardEvent) {
  sh.pressedKeys.add(e.key);
  if (e.repeat) {
    return;
  }

  // if (e.key === 'ArrowLeft') {
  //   store.dispatch(closeAllNodes());
  // } else if (e.key === 'ArrowRight') {
  //   store.dispatch(openAllNodes());
  // }
}

function handleKeyUp(e: KeyboardEvent) {
  sh.pressedKeys.delete(e.key);
  if (e.repeat) {
    return;
  }
}
