import { SIDToCID } from '@/utils/general';
import TreeLine from './TreeLine';
import TreeNode from './TreeNode';
import { useAppSelector } from '@/state/store';
import { sh } from '@/state/shadowStore';
import { TREE_CONTAINER_ID } from '@/utils/constants';
import NodeCaret from './NodeCaret';

export default function TreeContainer() {
  const contentModel = useAppSelector((state) => state.contentModel);
  const structureModel = useAppSelector((state) => state.structureModel);

  const visibleNodes = Array.from(sh.positionModel!.values());

  return (
    <div className='bg-gray-800 p-8'>
      <div
        className='relative flex flex-col text-gray-300 text-sm'
        id={TREE_CONTAINER_ID}
      >
        {visibleNodes.map(({ sid, row }) => (
          <TreeNode
            key={sid}
            sid={sid}
            type={contentModel[SIDToCID(sid)].type}
            opened={structureModel[sid].opened}
            isLeaf={structureModel[sid].children.length === 0}
            row={row.me}
          />
        ))}
        {visibleNodes.map(({ sid, row }) => (
          <TreeLine key={sid} sid={sid} row={row} />
        ))}
        <NodeCaret />
      </div>
    </div>
  );
}
