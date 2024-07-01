import { SID_DELIMITER } from '@/utils/constants';
import { dataContentModel, rootId } from '@/utils/dataContentModel';
import { genPositionModel } from '@/utils/dataPositionModel';
import { genStructureModel } from '@/utils/dataStructureModel';
import {
  SIDToCID,
  SIDToParentCID,
  genCID,
  genCopyNode,
  genNewNode,
  insertElem,
  insertNodeIntoContentModel,
  isAncestor,
  isChild,
  moveElem,
  removeElem,
  updateStructureModel,
} from '@/utils/general';
import { CID, Caret, ContentModel, SID, StructureModel } from '@/utils/types';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { sh } from './shadowStore';

type RootState = {
  contentModel: ContentModel;
  structureModel: StructureModel;
  rootSid: SID;
  caret: Caret;
};

const initialState: RootState = {
  contentModel: dataContentModel,
  structureModel: genStructureModel(rootId, dataContentModel),
  rootSid: rootId,
  caret: {
    visible: false,
    yMe: -1,
    yCaret: -1,
    yLastChild: -1,
    layer: -1,
    sid: '',
    pos: -1,
  },
};

export const counterSlice = createSlice({
  name: 'root',
  initialState,
  reducers: {
    toggleOpen: rA<SID>((s, sid) => {
      s.structureModel[sid].opened = !s.structureModel[sid].opened;
      genPositionModel(s.rootSid, s.structureModel);
    }),
    hideCaret: rN((s) => {
      s.caret.visible = false;
    }),
    showCaret: rA<Caret>((s, newCaret) => {
      s.caret = newCaret;
    }),
    createNode: rA<{ sid: SID; pos: number }>((s, { sid, pos }) => {
      const { newNode } = genNewNode();
      const parentCid = SIDToCID(sid);
      const parentType = s.contentModel[parentCid].type;
      newNode.type = parentType;
      sh.inputFocusSid = sid + SID_DELIMITER + newNode.cid;
      insertNodeIntoContentModel(s, newNode, sid, pos);
    }),
    moveNode: rA<{ sidFrom: SID; sidParentTo: SID; posTo: number }>(
      (s, { sidFrom, sidParentTo, posTo }) => {
        const cid = SIDToCID(sidFrom);
        const cidParentFrom = SIDToParentCID(sidFrom);
        const cidParentTo = SIDToCID(sidParentTo);
        const posFrom = s.contentModel[cidParentFrom].children.indexOf(cid);
        const cFrom = s.contentModel[cid];
        const cParentTo = s.contentModel[cidParentTo];
        const cParentFrom = s.contentModel[cidParentFrom];

        if (cidParentFrom === cidParentTo) {
          // case 1: same parent
          const posToI = posFrom < posTo ? posTo - 1 : posTo; // need to update from caret coordinates (inbetween) to index coordinates
          const children = s.contentModel[cidParentTo].children;
          s.contentModel[cidParentTo].children = moveElem(
            children,
            posFrom,
            posToI
          );
          updateStructureModel(s);
        } else {
          // case 2: separate parents
          //   check constraints
          if (isAncestor(sidFrom, sidParentTo) || isChild(cFrom, cParentTo)) {
            const constraint = isAncestor(sidFrom, sidParentTo)
              ? 'is ancestor'
              : 'is child';
            console.log('violated constraint: ', constraint);
            return;
          }

          //   update
          s.contentModel[cidParentFrom].children = removeElem(
            cParentFrom.children,
            posFrom
          );
          s.contentModel[cidParentTo].children = insertElem(
            cParentTo.children,
            cid,
            posTo
          );
          updateStructureModel(s);
        }
      }
    ),
    deleteNode: rA<SID>((s, sid) => {
      const cid = SIDToCID(sid);
      const parentCID = SIDToParentCID(sid);
      const children = s.contentModel[parentCID].children;
      s.contentModel[parentCID].children = children.filter((id) => id !== cid);
      updateStructureModel(s);
    }),
    copyNode: rA<{ sid: SID; pos: number; copySid: SID }>(
      (s, { sid, pos, copySid }) => {
        const copyCid = SIDToCID(copySid);
        const cNode = s.contentModel[copyCid];
        const { copyNode } = genCopyNode(cNode);
        insertNodeIntoContentModel(s, copyNode, sid, pos);
      }
    ),
    updateText: rA<{ cid: CID; text: string }>((s, { cid, text }) => {
      s.contentModel[cid].title = text;
    }),
  },
});

export const {
  toggleOpen,
  hideCaret,
  showCaret,
  createNode,
  copyNode,
  deleteNode,
  moveNode,
  updateText,
} = counterSlice.actions;

export default counterSlice.reducer;

// Reduce with No action: shorthand to create reducers with no action payloads
function rN(func: (state: RootState) => void) {
  return (state: RootState) => {
    func(state);
  };
}

// Reduce with Action: shorthand to create reducers with action payloads
function rA<T>(func: (state: RootState, action: T) => void) {
  return (state: RootState, action: PayloadAction<T>) => {
    func(state, action.payload);
  };
}
