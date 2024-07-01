import { dataContentModel } from '@/utils/dataContentModel';
import { CID, PositionNode, Row, SID } from '@/utils/types';

type ShadowStore = {
  positionModel: Map<SID, PositionNode>;
  positionElems: Map<Row, HTMLDivElement>; // all corresponding elems in the position model
  positionElemsSet: boolean; // flag if position elems have been set
  treeContainerElem: HTMLDivElement | null;
  cids: Set<CID>; // all cids in the content model
  pressedKeys: Set<string>;
  selectedSid: SID | null; // node that's been clicked on
  inputFocusSid: SID | null; // node that's just been created and should be focused on
};

export const sh: ShadowStore = {
  positionModel: new Map(),
  positionElems: new Map(),
  positionElemsSet: false,
  treeContainerElem: null,
  cids: new Set(Object.keys(dataContentModel)),
  pressedKeys: new Set(),
  selectedSid: null,
  inputFocusSid: null,
};
