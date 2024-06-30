import { sh } from '@/state/shadowStore';
import { PositionNode, SID, StructureModel, StructureNode } from './types';

const newNode = (sid: SID): PositionNode => ({
  sid,
  row: { me: 0, lastChild: 0, lastDescendant: 0 },
});

export function genPositionModel(rootSid: SID, data: StructureModel) {
  let row = 0;
  sh.positionModel.clear();

  function dfs(node: StructureNode) {
    const positionNode = newNode(node.sid);
    sh.positionModel.set(node.sid, positionNode);

    row++;
    positionNode.row.me = row;
    positionNode.row.lastChild = row;
    if (node.opened) {
      for (let s = 0; s < node.children.length; s++) {
        if (s === node.children.length - 1) {
          positionNode.row.lastChild = row + 1;
        }
        dfs(data[node.children[s]]);
      }
    }
    positionNode.row.lastDescendant = row;
  }

  dfs(data[rootSid]);

  // genPositionModel is called when genStructureModel is updated
  // At this point:
  //   1) positionElems is now outdated
  //   2) positionElems can't be updated until the dom has updated
  //
  // We should therefore flag that the positionElems is outdated,
  // So that the next function which uses it can repopulate the cache
  clearPositionElems();
}

export function clearPositionElems() {
  sh.positionElems.clear();
  sh.positionElemsSet = false;
}

export function genPositionElems() {
  sh.positionElems.clear();
  for (const { row } of sh.positionModel.values()) {
    const elem = document.querySelector(`[data-row="${row.me}"]`) as
      | HTMLDivElement
      | undefined;
    if (elem != null) {
      sh.positionElems.set(row.me, elem);
    }
  }
  sh.positionElemsSet = true;
}
