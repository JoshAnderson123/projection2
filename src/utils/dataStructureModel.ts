import { CIDsToSID } from './general';
import { genPositionModel } from './dataPositionModel';
import { CID, ContentModel, SID, StructureModel } from './types';

function dfs(
  cid: CID,
  data: ContentModel,
  prev: StructureModel = {},
  path: CID[] = [],
  result: StructureModel = {}
) {
  const cNode = data[cid];
  const newPath = [...path, cNode.cid];
  const sid: SID = CIDsToSID(newPath);
  const children: SID[] = [];
  result[sid] = {
    sid,
    children,
    opened: prev[sid]?.opened ?? true,
  };

  for (const childCID of cNode.children) {
    const childSID = CIDsToSID([...newPath, childCID]);
    children.push(childSID);
    dfs(childCID, data, prev, newPath, result);
  }

  return result;
}

export function genStructureModel(
  cid: CID,
  data: ContentModel,
  prev?: StructureModel
): StructureModel {
  const structureModel = dfs(cid, data, prev);
  genPositionModel(cid, structureModel);
  return structureModel;
}

// todo: update genStructureModel to make opened = previous value
