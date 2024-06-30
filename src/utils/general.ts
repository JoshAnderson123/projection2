import { sh } from '@/state/shadowStore';
import {
  LAYER_PADDING,
  LAYER_SPACING,
  NODE_HEIGHT,
  N_DIGITS,
  SID_DELIMITER,
  TREE_CONTAINER_ID,
} from './constants';
import { CID, Caret, ContentNode, SID, StructureNode } from './types';
import { RootState, store } from '@/state/store';
import { hideCaret, showCaret } from '@/state/rootSlice';
import { genStructureModel } from './dataStructureModel';

export function CIDsToSID(cids: CID[]): SID {
  return cids.join(SID_DELIMITER);
}

export function SIDToCID(sid: SID): CID {
  return sid.split(SID_DELIMITER).at(-1) ?? '';
}

export function SIDToCIDs(sid: SID): CID[] {
  return sid.split(SID_DELIMITER);
}

export function SIDToParentCID(sid: SID): CID {
  return sid.split(SID_DELIMITER).at(-2) ?? '';
}

export function SIDToLayers(sid: SID): number {
  return sid.split(SID_DELIMITER).length - 1;
}

export function layerToPadLeft(layer: number): number {
  return LAYER_PADDING + layer * LAYER_SPACING;
}

export function getTreeLineSidFromEvent(e: PointerEvent): SID | null {
  let elem = e.target as Node | null;
  while (elem != document && elem != null) {
    if (elem instanceof HTMLElement && elem.hasAttribute('data-vline-sid')) {
      return elem.getAttribute('data-vline-sid');
    }
    elem = elem.parentElement;
  }
  return null;
}

export function getIconSidFromEvent(e: PointerEvent): SID | null {
  let elem = e.target as Node | null;
  while (elem != document && elem != null) {
    if (elem instanceof HTMLElement && elem.hasAttribute('data-icon-sid')) {
      return elem.getAttribute('data-icon-sid');
    }
    elem = elem.parentElement;
  }
  return null;
}

export function getElemFromSid(sid: SID) {
  const row = sh.positionModel.get(sid)!.row.me;
  return sh.positionElems.get(row)!;
}

export function getTreeContainerElem(): HTMLDivElement {
  if (sh.treeContainerElem != null) {
    return sh.treeContainerElem;
  }
  return document.querySelector(`#${TREE_CONTAINER_ID}`)!;
}

function decToBase(num: number, base: number) {
  if (num === 0) {
    return '0';
  }
  let result = '';
  while (num > 0) {
    const remainder = num % base;
    result = N_DIGITS[remainder] + result;
    num = Math.floor(num / base);
  }
  return result;
}

function randBase(len: number, base: number) {
  let result = '';
  while (result.length < len) {
    result += N_DIGITS[Math.floor(Math.random() * base)];
  }
  return result;
}

function randCid(): CID {
  return randBase(5, 62);
}

export function genCID(): CID {
  let newCid = randCid();
  while (sh.cids.has(newCid)) {
    newCid = randCid();
  }
  sh.cids.add(newCid);
  return newCid;
}

export function calcCaretPosition(e: PointerEvent) {
  const sid = getTreeLineSidFromEvent(e);
  if (sid == null || !sh.positionElemsSet) {
    store.dispatch(hideCaret());
    return;
  }

  // 1) get all direct children of sid
  const structureNode = store.getState().structureModel[sid];
  const children = structureNode.opened ? structureNode.children : [];

  // 2) calculate the vertical cutoff position for each child
  const childrenYPos = children
    .map((sid) => getElemFromSid(sid).offsetTop + NODE_HEIGHT / 2)
    .sort((a, b) => a - b);

  const treeContainer = getTreeContainerElem();

  // 3) determine which children the click was inbetween
  const clickY = e.clientY - treeContainer.getBoundingClientRect().y;
  let pos = 0;
  while (pos < childrenYPos.length && childrenYPos[pos] < clickY) {
    pos++;
  }

  let yCaret = 0;

  // 4) determine what yPos the inbetween line should be
  if (pos === children.length) {
    // edge case - insert after last child (if any)
    const lastDescendantRow = sh.positionModel.get(sid)!.row.lastDescendant;
    const rowElem = sh.positionElems.get(lastDescendantRow)!;
    yCaret = rowElem.offsetTop + rowElem.offsetHeight;
  } else {
    const child2Sid = children[pos]; // definition: child1 - inbetween - child2
    const rowElem = getElemFromSid(child2Sid);
    yCaret = rowElem.offsetTop;
  }

  const yMe = getElemFromSid(sid).offsetTop + NODE_HEIGHT / 2;

  const newCaret: Caret = {
    visible: true,
    sid,
    pos,
    yCaret,
    yLastChild: childrenYPos.at(-1) ?? -1,
    yMe,
    layer: SIDToLayers(sid),
  };

  store.dispatch(showCaret(newCaret));
}

export function updateStructureModel(s: RootState) {
  s.structureModel = genStructureModel(
    s.rootSid,
    s.contentModel,
    s.structureModel
  );
}

export function insertElem<T>(array: T[], elem: T, pos: number) {
  const before = array.slice(0, pos);
  const after = array.slice(pos);
  return [...before, elem, ...after];
}

export function removeElem<T>(array: T[], pos: number) {
  // const before = array.slice(0, pos);
  // const after = array.slice(pos + 1);
  // return [...before, ...after];
  return array.filter((_, i) => i !== pos);
}

export function swapElem<T>(array: T[], pos1: number, pos2: number) {
  return array.map((_, i) =>
    i === pos1 ? array[pos2] : i === pos2 ? array[pos1] : array[i]
  );
}

export function moveElem<U>(array: U[], F: number, T: number) {
  if (F === T) {
    return array;
  }
  const copy = [...array];
  const temp = array[F];
  if (F < T) {
    for (let i = F; i < T; i++) {
      copy[i] = copy[i + 1];
    }
  } else {
    for (let i = F; i > T; i--) {
      copy[i] = copy[i - 1];
    }
  }
  copy[T] = temp;

  return copy;
}

export function isAncestor(sid1: SID, sid2: SID) {
  // 1 not ancestor of 2
  const cid1 = SIDToCID(sid1);
  const cids2 = SIDToCIDs(sid2);
  return cids2.includes(cid1);
}

export function isChild(cNode1: ContentNode, cNode2: ContentNode) {
  // 1 not child of 2
  return cNode2.children.includes(cNode1.cid);
}

export function genNewNode() {
  const newCID = genCID();
  const newNode: ContentNode = {
    cid: newCID,
    title: 'New node!',
    type: 'goal',
    children: [],
  };
  return { newCID, newNode };
}

export function genCopyNode(cNode: ContentNode) {
  const newCID = genCID();
  const copyNode: ContentNode = {
    ...cNode,
    cid: newCID,
  };
  return { newCID, copyNode };
}

export function insertNodeIntoContentModel(
  s: RootState,
  node: ContentNode,
  sid: SID,
  pos: number
) {
  s.contentModel[node.cid] = node;
  const parentCID = SIDToCID(sid);
  const children = s.contentModel[parentCID].children;
  s.contentModel[parentCID].children = insertElem(children, node.cid, pos);
  updateStructureModel(s);
}
