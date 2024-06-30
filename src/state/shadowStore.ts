import { dataContentModel } from '@/utils/dataContentModel';
import { CID, PositionNode, Row, SID } from '@/utils/types';

type ShadowStore = {
  positionModel: Map<SID, PositionNode>;
  positionElems: Map<Row, HTMLDivElement>;
  positionElemsSet: boolean;
  treeContainerElem: HTMLDivElement | null;
  cids: Set<CID>;
  pressedKeys: Set<string>;
  selectedSid: SID | null;
};

export const sh: ShadowStore = {
  positionModel: new Map(),
  positionElems: new Map(),
  positionElemsSet: false,
  treeContainerElem: null,
  cids: new Set(Object.keys(dataContentModel)),
  pressedKeys: new Set(),
  selectedSid: null,
};
